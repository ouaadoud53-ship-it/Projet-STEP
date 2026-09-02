import React, { useState, useEffect } from 'react';
import { serieService, marcheService } from '../services/api';
import { Serie, Marche } from '../types';
import { Layers, Briefcase, Calculator, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import { showError } from '../utils/alerts';

export const Series: React.FC = () => {
  const [marches, setMarches] = useState<Marche[]>([]);
  const [selectedMarcheId, setSelectedMarcheId] = useState<string>('');
  const [series, setSeries] = useState<Serie[]>([]);
  const [loadingMarches, setLoadingMarches] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les marchés pour le filtre
  useEffect(() => {
    const fetchMarches = async () => {
      try {
        setLoadingMarches(true);
        const data = await marcheService.getAll(undefined, undefined, 1, 100);
        setMarches(data.items);
        if (data.items.length > 0) {
          setSelectedMarcheId(data.items[0].id);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des marchés.');
      } finally {
        setLoadingMarches(false);
      }
    };
    fetchMarches();
  }, []);

  // Charger les séries du marché sélectionné
  useEffect(() => {
    const fetchSeries = async () => {
      if (!selectedMarcheId) return;
      try {
        setLoadingSeries(true);
        const data = await serieService.getAll(selectedMarcheId);
        setSeries(data.items);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des séries.');
      } finally {
        setLoadingSeries(false);
      }
    };
    fetchSeries();
  }, [selectedMarcheId]);

  const formatterEuros = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(value);
  };

  const selectedMarche = marches.find((m) => m.id === selectedMarcheId);

  // Calcul du montant total cumulé de la série
  const totalAmount = series.reduce((sum, s) => sum + (s.pptMarcheHT || 0), 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Serie | null>(null);
  const [formData, setFormData] = useState({ code: '', serie: '', unite: '', quantite: '', puMarcheHT: '' });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ code: '', serie: '', unite: '', quantite: '', puMarcheHT: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Serie) => {
    setEditingItem(s);
    setFormData({ code: s.code, serie: s.serie, unite: s.unite, quantite: s.quantite === 0 ? '' : s.quantite.toString(), puMarcheHT: s.puMarcheHT === 0 ? '' : s.puMarcheHT.toString() });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedMarcheId) throw new Error('Aucun marché sélectionné');
      const payload = {
        ...formData,
        quantite: Number(formData.quantite),
        puMarcheHT: Number(formData.puMarcheHT),
      };
      if (editingItem) {
        await serieService.update(editingItem.id, payload as any);
      } else {
        await serieService.create({ ...payload, marcheId: selectedMarcheId } as any);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      const data = await serieService.getAll(selectedMarcheId);
      setSeries(data.items);
    } catch (err) {
      console.error(err);
      showError('Enregistrement impossible', (err as any).response?.data?.message || (err as Error).message || 'Erreur lors de l’enregistrement.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette série ?')) return;
    try {
      await serieService.delete(id);
      const data = await serieService.getAll(selectedMarcheId);
      setSeries(data.items);
    } catch (err) {
      console.error(err);
      showError('Suppression impossible', 'Erreur lors de la suppression.');
    }
  };

  const computedPpt = Number(formData.quantite || 0) * Number(formData.puMarcheHT || 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Consultation des Séries</h2>
        <p className="text-muted-foreground">Sélectionnez un marché pour visualiser la structure de ses séries de travaux.</p>
      </div>

      {/* Market Selector */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground">
            <Briefcase size={14} />
            Marché / Affaire référente
          </label>
          {loadingMarches ? (
            <div className="h-10 bg-secondary/50 rounded-xl animate-pulse" />
          ) : (
            <select
              value={selectedMarcheId}
              onChange={(e) => setSelectedMarcheId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
            >
              {marches.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.codeAffaire}] {m.maitreOuvrage} - Marché {m.numeroMarche}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 hover:opacity-90 transition-all duration-200"
          >
            <Plus size={16} />
            Nouvelle Série
          </button>
        </div>

        {selectedMarche && (
          <div className="text-sm border-l-2 border-primary/20 pl-4 space-y-1">
            <div className="font-semibold text-foreground">Détails contractuels :</div>
            <div className="text-muted-foreground">
              Partenaire : <span className="text-foreground font-medium">{selectedMarche.partenaire}</span>
            </div>
            <div className="text-muted-foreground">
              Date OS : <span className="text-foreground font-medium">{new Date(selectedMarche.dateOSCommencement).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Series list */}
      {loadingSeries ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : series.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium bg-muted/20">
                    <th className="py-4 px-6">Code Série</th>
                    <th className="py-4 px-6">Marché</th>
                    <th className="py-4 px-6">Désignation de la Série</th>
                    <th className="py-4 px-6 text-center">Unité</th>
                    <th className="py-4 px-6 text-right">Quantité</th>
                    <th className="py-4 px-6 text-right">PU Marché HT</th>
                    <th className="py-4 px-6 text-right">PPT Marché HT</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/15 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">{s.code}</td>
                      <td className="py-4 px-6 text-muted-foreground">{s.marche ? `${s.marche.codeAffaire} - ${s.marche.numeroMarche}` : selectedMarche?.codeAffaire ?? '-'}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{s.serie}</td>
                      <td className="py-4 px-6 text-center text-muted-foreground font-medium">{s.unite}</td>
                      <td className="py-4 px-6 text-right font-medium text-muted-foreground">{s.quantite}</td>
                      <td className="py-4 px-6 text-right font-medium text-foreground">{formatterEuros(s.puMarcheHT)}</td>
                      <td className="py-4 px-6 text-right font-bold text-primary">{formatterEuros(s.pptMarcheHT)}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(s)} className="p-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sum section */}
            <div className="bg-primary/5 border-t border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Calculator size={18} />
                <span>Valeur Totale du Marché (Séries) :</span>
              </div>
              <div className="text-xl font-bold text-primary">
                {formatterEuros(totalAmount)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center">
          <Layers className="mx-auto text-muted-foreground mb-4" size={40} />
          <h3 className="font-bold text-lg mb-1">Aucune série configurée</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Aucune série n'a été rattachée à ce marché pour le moment.
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg p-6 rounded-2xl shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4">{editingItem ? 'Modifier la Série' : 'Nouvelle Série'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Code *</label>
                  <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Série *</label>
                  <input type="text" required value={formData.serie} onChange={(e) => setFormData({ ...formData, serie: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Unité *</label>
                  <input type="text" required value={formData.unite} onChange={(e) => setFormData({ ...formData, unite: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Quantité *</label>
                  <input type="number" required step="any" value={formData.quantite} onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">PU Marché HT *</label>
                  <input type="number" required step="any" value={formData.puMarcheHT} onChange={(e) => setFormData({ ...formData, puMarcheHT: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1.5">PPT Marché HT</label>
                  <div className="w-full px-4 py-2 rounded-xl border border-input bg-background text-right font-semibold">{computedPpt.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-border hover:bg-secondary">Annuler</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Series;
