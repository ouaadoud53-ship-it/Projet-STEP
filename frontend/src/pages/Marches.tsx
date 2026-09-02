import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { marcheService } from '../services/api';
import { Marche, EtatMarche } from '../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Briefcase,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User,
  Users
} from 'lucide-react';
import { showError } from '../utils/alerts';

export const Marches: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [etat, setEtat] = useState<EtatMarche | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarche, setEditingMarche] = useState<Marche | null>(null);
  const [formData, setFormData] = useState({
    codeAffaire: '',
    numeroMarche: '',
    maitreOuvrage: '',
    partenaire: '',
    dateOSCommencement: '',
    delaiProjetMois: '' as number | string,
    etat: '' as EtatMarche | '',
  });

  const fetchMarches = async () => {
    try {
      setLoading(true);
      const data = await marcheService.getAll(search, etat || undefined, page, 10);
      setMarches(data.items);
      setTotalPages(data.pages);
      setTotalItems(data.total);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Erreur lors de la récupération des marchés.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarches();
  }, [search, etat, page]);

  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal) {
      setSearch(searchVal);
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingMarche(null);
    setFormData({
      codeAffaire: '',
      numeroMarche: '',
      maitreOuvrage: '',
      partenaire: '',
      dateOSCommencement: '',
      delaiProjetMois: '',
      etat: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (marche: Marche) => {
    setEditingMarche(marche);
    setFormData({
      codeAffaire: marche.codeAffaire,
      numeroMarche: marche.numeroMarche,
      maitreOuvrage: marche.maitreOuvrage,
      partenaire: marche.partenaire,
      dateOSCommencement: new Date(marche.dateOSCommencement).toISOString().split('T')[0],
      delaiProjetMois: marche.delaiProjetMois === 0 ? '' : marche.delaiProjetMois,
      etat: marche.etat,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      delaiProjetMois: Number(formData.delaiProjetMois),
      etat: formData.etat as EtatMarche,
    };
    try {
      if (editingMarche) {
        await marcheService.update(editingMarche.id, payload);
      } else {
        await marcheService.create(payload);
      }
      setIsModalOpen(false);
      fetchMarches();
    } catch (err: any) {
      console.error(err);
      showError('Enregistrement impossible', err.response?.data?.message || 'Erreur lors de l’enregistrement du marché.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce marché ? Toutes les séries et ouvrages rattachés seront supprimés.')) {
      try {
        await marcheService.delete(id);
        fetchMarches();
      } catch (err) {
        console.error(err);
        showError('Suppression impossible', 'Erreur lors de la suppression du marché.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Marchés</h2>
          <p className="text-muted-foreground">Créez et configurez les affaires et contrats de travaux.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 hover:opacity-90 transition-all duration-200"
        >
          <Plus size={18} />
          Nouveau Marché
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Rechercher par code, marché, client, partenaire..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={etat}
            onChange={(e) => { setEtat(e.target.value as EtatMarche | ''); setPage(1); }}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="">Tous les états</option>
            <option value="PREPARATION">Préparation</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminé</option>
            <option value="CLOTURE">Clôturé</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Table view */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : marches.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-medium bg-muted/20">
                  <th className="py-4 px-6">Code Affaire</th>
                  <th className="py-4 px-6">N° Marché</th>
                  <th className="py-4 px-6">Maître d'Ouvrage</th>
                  <th className="py-4 px-6">Partenaire</th>
                  <th className="py-4 px-6">Commencement</th>
                  <th className="py-4 px-6">Délai (Mois)</th>
                  <th className="py-4 px-6">État</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marches.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{m.codeAffaire}</td>
                    <td className="py-4 px-6 text-muted-foreground">{m.numeroMarche}</td>
                    <td className="py-4 px-6 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        {m.maitreOuvrage}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-muted-foreground" />
                        {m.partenaire}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(m.dateOSCommencement).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Clock size={14} />
                        {m.delaiProjetMois} mois
                      </div>
                    </td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/10">
              <span className="text-sm text-muted-foreground">
                Affichage de {marches.length} sur {totalItems} marchés
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-xl bg-card hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold px-2">
                  Page {page} sur {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 border border-border rounded-xl bg-card hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center">
          <Briefcase className="mx-auto text-muted-foreground mb-4" size={40} />
          <h3 className="font-bold text-lg mb-1">Aucun marché trouvé</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Essayez de modifier votre recherche ou ajoutez un nouveau marché en cliquant sur le bouton ci-dessus.
          </p>
        </div>
      )}

      {/* Modal - Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl p-6 rounded-2xl shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4">
              {editingMarche ? 'Modifier le Marché' : 'Nouveau Marché'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1.5">Code Affaire *</label>
                <input
                  type="text"
                  required
                  value={formData.codeAffaire}
                  onChange={(e) => setFormData({ ...formData, codeAffaire: e.target.value })}
                  placeholder="ex: CA-2026-001"
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">N° Marché *</label>
                <input
                  type="text"
                  required
                  value={formData.numeroMarche}
                  onChange={(e) => setFormData({ ...formData, numeroMarche: e.target.value })}
                  placeholder="ex: M-987654"
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Maître d'Ouvrage (Client) *</label>
                <input
                  type="text"
                  required
                  value={formData.maitreOuvrage}
                  onChange={(e) => setFormData({ ...formData, maitreOuvrage: e.target.value })}
                  placeholder="Client du marché"
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Partenaire Co-traitant / Groupement *</label>
                <input
                  type="text"
                  required
                  value={formData.partenaire}
                  onChange={(e) => setFormData({ ...formData, partenaire: e.target.value })}
                  placeholder="Partenaire ou 'Aucun'"
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Date OS Commencement *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOSCommencement}
                  onChange={(e) => setFormData({ ...formData, dateOSCommencement: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Délai Projet (Mois) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.delaiProjetMois}
                  onChange={(e) => setFormData({ ...formData, delaiProjetMois: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">État *</label>
                <select
                  required
                  value={formData.etat}
                  onChange={(e) => setFormData({ ...formData, etat: e.target.value as EtatMarche })}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="">Sélectionner un état</option>
                  <option value="PREPARATION">Préparation</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINE">Terminé</option>
                  <option value="CLOTURE">Clôturé</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Marches;
