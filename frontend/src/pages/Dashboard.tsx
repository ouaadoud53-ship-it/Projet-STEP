import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { DashboardStats } from '../types';
import {
  Briefcase,
  Calculator,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend, isPositive }) => (
  <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="p-3 bg-secondary rounded-xl text-foreground/80">{icon}</div>
    </div>
    <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
    {(description || trend) && (
      <div className="flex items-center gap-1.5 text-xs">
        {trend && (
          <span className={`font-semibold flex items-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend}
          </span>
        )}
        <span className="text-muted-foreground">{description}</span>
      </div>
    )}
  </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des statistiques du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
        <AlertTriangle />
        <span>{error || 'Statistiques indisponibles.'}</span>
      </div>
    );
  }

  const { counts, financials, chartMarches, chartSections } = stats;

  const formatterEuros = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Header Panel */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Tableau de bord</h2>
        <p className="text-muted-foreground">Synthèse financière et suivi de la rentabilité des marchés en cours.</p>
      </div>

      {/* Grid of Counts & Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Marchés enregistrés"
          value={counts.marches}
          icon={<Briefcase size={20} />}
          description="Projets actifs ou clos"
        />
        <StatCard
          title="Total Prix Vente HT"
          value={formatterEuros(financials.totalPrixVente)}
          icon={<TrendingUp size={20} className="text-blue-500" />}
          description="Chiffre d'Affaires global"
        />
        <StatCard
          title="Total Coûts Production"
          value={formatterEuros(financials.totalCoutProduction)}
          icon={<Calculator size={20} className="text-amber-500" />}
          description="Dépenses directes prévues"
        />
        <StatCard
          title="Marge globale"
          value={formatterEuros(financials.totalMarge)}
          icon={<ArrowUpRight size={20} className={financials.totalMarge >= 0 ? 'text-emerald-500' : 'text-rose-500'} />}
          trend={`${financials.rentabiliteGlobale.toFixed(1)}%`}
          isPositive={financials.totalMarge >= 0}
          description="rentabilité globale"
        />
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Comparison Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="font-bold text-lg mb-6">Comparatif Ventes vs Coûts par Marché</h3>
          <div className="h-80">
            {chartMarches.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartMarches}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="codeAffaire" />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}kDH`} />
                  <Tooltip
                    formatter={(value: any) => formatterEuros(Number(value))}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)' }}
                  />
                  <Legend />
                  <Bar dataKey="prixVente" name="Prix Vente HT" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="coutProduction" name="Coût Production" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Aucune donnée disponible.</div>
            )}
          </div>
        </div>

        {/* Cost Distribution Pie Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-lg mb-6">Répartition des Coûts de Production</h3>
          <div className="h-80 relative flex items-center justify-center">
            {chartSections.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartSections}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartSections.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatterEuros(Number(value))} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Aucune décomposition saisie.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Summary Tables */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Synthèse Financière des Affaires</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-medium">
                <th className="py-3 px-4">Code Affaire</th>
                <th className="py-3 px-4">Maître d'Ouvrage</th>
                <th className="py-3 px-4">État</th>
                <th className="py-3 px-4 text-right">Prix Vente</th>
                <th className="py-3 px-4 text-right">Coût Production</th>
                <th className="py-3 px-4 text-right">Marge Totale</th>
                <th className="py-3 px-4 text-right">Rentabilité</th>
              </tr>
            </thead>
            <tbody>
              {chartMarches.map((m) => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">{m.codeAffaire}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{m.maitreOuvrage}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      m.etat === 'EN_COURS' ? 'bg-blue-500/10 text-blue-500' :
                      m.etat === 'PREPARATION' ? 'bg-amber-500/10 text-amber-500' :
                      m.etat === 'TERMINE' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {m.etat === 'EN_COURS' ? 'En cours' :
                       m.etat === 'PREPARATION' ? 'Préparation' :
                       m.etat === 'TERMINE' ? 'Terminé' : 'Clôturé'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">{formatterEuros(m.prixVente)}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">{formatterEuros(m.coutProduction)}</td>
                  <td className={`py-3.5 px-4 text-right font-semibold ${m.marge >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatterEuros(m.marge)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${
                      m.rentabilite > 15 ? 'bg-emerald-500/10 text-emerald-500' :
                      m.rentabilite >= 0 ? 'bg-amber-500/10 text-amber-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {m.rentabilite}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
