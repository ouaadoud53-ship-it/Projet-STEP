import React, { useState, useEffect } from 'react';
import { ouvrageService, serieService } from '../services/api';
import { Ouvrage, Serie } from '../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  FolderKanban,
  Calculator,
  FileText
} from 'lucide-react';
import { showError, showSuccess } from '../utils/alerts';

export const Ouvrages: React.FC = () => {
  const [ouvrages, setOuvrages] = useState<Ouvrage[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [selectedSerieId, setSelectedSerieId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finishedSeries, setFinishedSeries] = useState<Record<string, boolean>>({});

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOuvrage, setEditingOuvrage] = useState<Ouvrage | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    numeroPrixBordereau: '',
    ouvrage: '',
    unite: '',
    quantite: '' as number | string,
    puMarcheHT: '' as number | string,
    puRevientReference: '' as number | string,
    serieId: '',
  });

  const fetchOuvrages = async () => {
    try {
      setLoading(true);
      const data = await ouvrageService.getAll(selectedSerieId || undefined, search || undefined);
      setOuvrages(data.items);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des ouvrages.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeries = async () => {
    try {
      const data = await serieService.getAll();
      setSeries(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  // Load finished series state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('finishedSeries');
      if (raw) setFinishedSeries(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to load finishedSeries', err);
    }
  }, []);

  useEffect(() => {
    fetchOuvrages();
  }, [selectedSerieId, search]);

  const handleOpenCreate = () => {
    setEditingOuvrage(null);
    setFormData({
      code: '',
      numeroPrixBordereau: '',
      ouvrage: '',
      unite: '',
      quantite: '',
      puMarcheHT: '',
      puRevientReference: '',
      serieId: '',
    });
    setIsModalOpen(true);
  };

  const toggleFinishedForSelectedSerie = () => {
    if (!selectedSerieId) return;
    const current = !!finishedSeries[selectedSerieId];
    const next = { ...finishedSeries, [selectedSerieId]: !current };
    console.log('Toggling finished for serie', selectedSerieId, 'from', current, 'to', !current);
    setFinishedSeries(next);
    try {
      localStorage.setItem('finishedSeries', JSON.stringify(next));
      showSuccess('État enregistré', `Série ${selectedSerieId} → ${!current ? 'Terminé' : 'Non Terminé'}`);
    } catch (err) {
      console.error('Failed to save finishedSeries', err);
    }
  };

  const handleOpenEdit = (ouvrage: Ouvrage) => {
    setEditingOuvrage(ouvrage);
    setFormData({
      code: ouvrage.code,
      numeroPrixBordereau: ouvrage.numeroPrixBordereau,
      ouvrage: ouvrage.ouvrage,
      unite: ouvrage.unite,
      quantite: ouvrage.quantite === 0 ? '' : ouvrage.quantite,
      puMarcheHT: ouvrage.puMarcheHT === 0 ? '' : ouvrage.puMarcheHT,
      puRevientReference: ouvrage.puRevientReference === 0 ? '' : ouvrage.puRevientReference,
      serieId: ouvrage.serieId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      quantite: Number(formData.quantite),
      puMarcheHT: Number(formData.puMarcheHT),
      puRevientReference: Number(formData.puRevientReference),
    };

    try {
      if (editingOuvrage) {
        await ouvrageService.update(editingOuvrage.id, payload);
      } else {
        await ouvrageService.create(payload);
      }
      setIsModalOpen(false);
      fetchOuvrages();
    } catch (err: any) {
      console.error(err);
      showError('Enregistrement impossible', err.response?.data?.message || 'Erreur lors de l’enregistrement de l’ouvrage.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ouvrage ? Les libellés de production et décompositions liés seront supprimés.')) {
      try {
        await ouvrageService.delete(id);
        fetchOuvrages();
      } catch (err) {
        console.error(err);
        showError('Suppression impossible', 'Erreur lors de la suppression de l’ouvrage.');
      }
    }
  };

  const formatterEuros = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(value);
  };

  const totalMarche = ouvrages.reduce((sum, o) => sum + (o.pptMarcheHT || 0), 0);
  const totalRevientRef = ouvrages.reduce((sum, o) => sum + (o.pptRevientReference || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Ouvrages (Bordereau Client)</h2>
          <p className="text-muted-foreground">Estimez et gérez les ouvrages liés aux séries du projet.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFinishedForSelectedSerie}
            disabled={!selectedSerieId}
            className={`px-4 py-2.5 rounded-xl font-semibold border ${selectedSerieId && finishedSeries[selectedSerieId] ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600'} transition-all`}
          >
            {selectedSerieId && finishedSeries[selectedSerieId] ? 'Terminé' : 'Non Terminé'}
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 hover:opacity-90 transition-all duration-200"
            disabled={!!selectedSerieId && !!finishedSeries[selectedSerieId]}
          >
            <Plus size={18} />
            Nouvel Ouvrage
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Rechercher par code, désignation ou numéro prix bordereau..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedSerieId}
            onChange={(e) => setSelectedSerieId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="">Toutes les séries</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.serie} {s.marche ? `(${s.marche.numeroMarche} / ${s.marche.codeAffaire})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state */}
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
      ) : ouvrages.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium bg-muted/20">
                    <th className="py-4 px-4">Code</th>
                    <th className="py-4 px-4">N° Prix Bordereau</th>
                    <th className="py-4 px-4">Série</th>
                    <th className="py-4 px-4">Désignation Ouvrage</th>
                    <th className="py-4 px-4 text-center">Unité</th>
                    <th className="py-4 px-4 text-right">Qté</th>
                    <th className="py-4 px-4 text-right">PU Marché HT</th>
                    <th className="py-4 px-4 text-right">PPT Marché HT</th>
                    <th className="py-4 px-4 text-right">PU Revient Réf</th>
                    <th className="py-4 px-4 text-right">PPT Revient Réf</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ouvrages.map((o) => (
                    <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                      <td className="py-4 px-4 font-semibold text-foreground">{o.code}</td>
                      <td className="py-4 px-4 text-muted-foreground">{o.numeroPrixBordereau}</td>
                      <td className="py-4 px-4 font-medium text-foreground">
                        <div className="inline-flex flex-col gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-secondary text-foreground text-xs font-semibold">
                            {o.serie?.code || 'N/A'}
                          </span>
                          {o.serie?.marche ? (
                            <span className="text-[11px] text-muted-foreground">
                              Marché {o.serie.marche.numeroMarche} / {o.serie.marche.codeAffaire}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-foreground max-w-xs truncate">{o.ouvrage}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground font-medium">{o.unite}</td>
                      <td className="py-4 px-4 text-right font-medium text-muted-foreground">{o.quantite}</td>
                      <td className="py-4 px-4 text-right font-semibold text-foreground">{formatterEuros(o.puMarcheHT)}</td>
                      <td className="py-4 px-4 text-right font-bold text-primary">{formatterEuros(o.pptMarcheHT)}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">{formatterEuros(o.puRevientReference)}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground font-semibold">{formatterEuros(o.pptRevientReference)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(o)}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total financial block */}
            <div className="bg-muted/10 border-t border-border px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  <Calculator size={15} /> Total Prix de Vente HT (Marché) :
                </span>
                <span className="font-bold text-primary text-lg">{formatterEuros(totalMarche)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  <FileText size={15} /> Total Revient Référence Cumulé :
                </span>
                <span className="font-bold text-muted-foreground text-lg">{formatterEuros(totalRevientRef)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center">
          <FolderKanban className="mx-auto text-muted-foreground mb-4" size={40} />
          <h3 className="font-bold text-lg mb-1">Aucun ouvrage trouvé</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Rattachez un nouvel ouvrage à une série en cliquant sur le bouton ci-dessus.
          </p>
        </div>
      )}

      {/* Modal - Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg p-6 rounded-2xl shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4">
              {editingOuvrage ? 'Modifier l’Ouvrage' : 'Nouvel Ouvrage'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Code Ouvrage *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ex: O-101"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">N° Prix Bordereau *</label>
                  <input
                    type="text"
                    required
                    value={formData.numeroPrixBordereau}
                    onChange={(e) => setFormData({ ...formData, numeroPrixBordereau: e.target.value })}
                    placeholder="ex: B-1.1"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Série Rattachée *</label>
                <select
                  required
                  value={formData.serieId}
                  onChange={(e) => setFormData({ ...formData, serieId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="">Sélectionner une série</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.serie} {s.marche ? `(${s.marche.numeroMarche} / ${s.marche.codeAffaire})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description de l'Ouvrage *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.ouvrage}
                  onChange={(e) => setFormData({ ...formData, ouvrage: e.target.value })}
                  placeholder="Détail ou désignation de l'ouvrage..."
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Unité *</label>
                  <input
                    type="text"
                    required
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    placeholder="ex: m3, m2, kg, u"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Quantité contractuelle *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">PU Marché HT *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.puMarcheHT}
                    onChange={(e) => setFormData({ ...formData, puMarcheHT: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">PU Revient Référence *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.puRevientReference}
                    onChange={(e) => setFormData({ ...formData, puRevientReference: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
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
export default Ouvrages;
