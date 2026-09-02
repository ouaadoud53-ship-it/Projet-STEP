import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { decompositionService, productionService } from '../services/api';
import { showError, showSuccess } from '../utils/alerts';
import { Decomposition, LibelleProduction } from '../types';
import {
  Plus,
  Edit2,
  Upload,
  Trash2,
  AlertTriangle,
  LineChart,
  Calculator,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const Decompositions: React.FC = () => {
  const [decompositions, setDecompositions] = useState<Decomposition[]>([]);
  const [libelles, setLibelles] = useState<LibelleProduction[]>([]);
  const [selectedLpId, setSelectedLpId] = useState<string>('');
  const [selectedLp, setSelectedLp] = useState<LibelleProduction | null>(null);
  const [loadingLibelles, setLoadingLibelles] = useState(true);
  const [loadingDecomps, setLoadingDecomps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecomp, setEditingDecomp] = useState<Decomposition | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    unite: '',
    libelleElement: '',
    uniteControle: '',
    section: '',
    quantite: '',
    prixUnitaire: '',
    libelleProductionId: '',
  });

  const fetchLibelles = async () => {
    try {
      setLoadingLibelles(true);
      const data = await productionService.getAll();
      setLibelles(data.items);
      if (data.items.length > 0) {
        setSelectedLpId(data.items[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des libellés de production.');
    } finally {
      setLoadingLibelles(false);
    }
  };

  const fetchDecompositions = async () => {
    if (!selectedLpId) return;
    try {
      setLoadingDecomps(true);
      const [decompData, lpData] = await Promise.all([
        decompositionService.getAll(selectedLpId),
        productionService.getById(selectedLpId)
      ]);
      setDecompositions(decompData.items);
      setSelectedLp(lpData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement de la décomposition.');
    } finally {
      setLoadingDecomps(false);
    }
  };

  useEffect(() => {
    fetchLibelles();
  }, []);

  useEffect(() => {
    fetchDecompositions();
  }, [selectedLpId]);

  const handleOpenCreate = () => {
    setEditingDecomp(null);
    setFormData({
      code: '',
      unite: '',
      libelleElement: '',
      uniteControle: '',
      section: '',
      quantite: '',
      prixUnitaire: '',
      libelleProductionId: selectedLpId,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Decomposition) => {
    setEditingDecomp(d);
    setFormData({
      code: d.code,
      unite: d.unite,
      libelleElement: d.libelleElement,
      uniteControle: d.uniteControle,
      section: d.section,
      quantite: d.quantite === 0 ? '' : String(d.quantite),
      prixUnitaire: d.prixUnitaire === 0 ? '' : String(d.prixUnitaire),
      libelleProductionId: d.libelleProductionId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantite: Number(formData.quantite),
        prixUnitaire: Number(formData.prixUnitaire),
      };
      if (editingDecomp) {
        await decompositionService.update(editingDecomp.id, payload);
      } else {
        await decompositionService.create(payload);
      }
      setIsModalOpen(false);
      fetchDecompositions();
    } catch (err: any) {
      console.error(err);
      showError('Enregistrement impossible', err.response?.data?.message || 'Erreur lors de l’enregistrement de l’élément.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet élément de décomposition ?')) {
      try {
        await decompositionService.delete(id);
        fetchDecompositions();
      } catch (err) {
        console.error(err);
        showError('Suppression impossible', 'Erreur lors de la suppression.');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedLpId) {
      showError('Sélection manquante', "Sélectionnez d'abord un Libellé de Production (LP) avant d'importer.");
      return;
    }

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: null });

        if (!data || data.length === 0) {
          showError('Fichier invalide', 'Le fichier est vide ou mal formaté.');
          return;
        }

        const itemsToImport: any[] = [];
        const errors: string[] = [];

        for (const [i, row] of data.entries()) {
          const code = row['code'] || row['Code'] || row['CODE'];
          const libelleElement = row['libelleElement'] || row['Libellé'] || row['Libelle'] || row['designation'] || row['designationElement'];
          const section = row['section'] || row['Section'] || row['SECTION'] || '';
          const unite = row['unite'] || row['Unité'] || row['unite'];
          const uniteControle = row['uniteControle'] || row['UniteControle'] || row['unite_controle'] || '';
          const quantite = Number(row['quantite'] ?? row['Quantité'] ?? row['qte'] ?? 0);
          const prixUnitaire = Number(row['prixUnitaire'] ?? row['PrixUnitaire'] ?? row['tarifUnitaire'] ?? row['prix'] ?? 0);

          if (!code || !libelleElement) {
            errors.push(`Ligne ${i + 2}: champs obligatoires manquants (code/libelleElement)`);
            continue;
          }

          itemsToImport.push({
            code: String(code),
            libelleElement: String(libelleElement),
            section: String(section || ''),
            unite: String(unite || ''),
            uniteControle: String(uniteControle || ''),
            quantite: Number(quantite || 0),
            prixUnitaire: Number(prixUnitaire || 0),
            libelleProductionId: selectedLpId,
          });
        }

        if (itemsToImport.length === 0) {
          showError('Aucun élément importé', errors.join('\n'));
          return;
        }

        // Create items sequentially or in parallel
        const results = await Promise.allSettled(itemsToImport.map(it => decompositionService.create(it)));
        const rej = results
          .map((r, idx) => ({ r, idx }))
          .filter(x => x.r.status === 'rejected')
          .map(x => `Ligne ${x.idx + 2}: erreur lors de la création`);

        let msg = `Import terminé: ${results.filter(r => r.status === 'fulfilled').length} importés.`;
        if (errors.length > 0 || rej.length > 0) {
          msg += '\nErreurs:\n' + errors.concat(rej).join('\n');
        }
        showSuccess('Import terminé', msg);
        fetchDecompositions();
      } catch (err) {
        console.error(err);
        showError('Import impossible', "Erreur lors de l'import du fichier.");
      } finally {
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const formatterEuros = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(value);
  };

  const totalCalculatedPU = decompositions.reduce((sum, d) => sum + (d.montant || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Décompositions (Sous-détail de prix)</h2>
          <p className="text-muted-foreground">Saisissez les consommations de ressources (Main d'œuvre, Matériaux, Engins).</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            hidden
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(e);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedLpId || importing}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-secondary/80 transition-all duration-200 disabled:opacity-50"
          >
            {importing ? <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
            Importer Excel
          </button>

          <button
            onClick={handleOpenCreate}
            disabled={!selectedLpId}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          >
            <Plus size={18} />
            Ajouter une Ressource
          </button>
        </div>
      </div>

      {/* Select Parent LP */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Sélectionner le Libellé de Production (Bordereau Interne)
        </label>
        {loadingLibelles ? (
          <div className="h-10 bg-secondary/50 rounded-xl animate-pulse" />
        ) : (
          <select
            value={selectedLpId}
            onChange={(e) => setSelectedLpId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
          >
            {libelles.map((l) => (
              <option key={l.id} value={l.id}>
                [{l.code}] {l.libelleProduction} ({l.quantite} {l.unite})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Parent LP Financial Summary Card */}
      {selectedLp && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Prix Vente Marché HT</span>
              <p className="text-xl font-bold">{formatterEuros(selectedLp.puMarcheHT)} / {selectedLp.unite}</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Calculator size={22} />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Coût de Production Calculé</span>
              <p className="text-xl font-bold text-amber-500">{formatterEuros(totalCalculatedPU)} / {selectedLp.unite}</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign size={22} />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Marge Unitaire Estimée</span>
              <p className={`text-xl font-bold ${(selectedLp.puMarcheHT - totalCalculatedPU) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatterEuros(selectedLp.puMarcheHT - totalCalculatedPU)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Decompositions Table */}
      {loadingDecomps ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : decompositions.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-medium bg-muted/20">
                  <th className="py-4 px-6">Code</th>
                  <th className="py-4 px-6">Désignation Élément</th>
                  <th className="py-4 px-6">Section de Coût</th>
                  <th className="py-4 px-6 text-center">Unité</th>
                  <th className="py-4 px-6 text-center">Unité Contrôle</th>
                  <th className="py-4 px-6 text-right">Quantité (Rendement)</th>
                  <th className="py-4 px-6 text-right">Tarif Unitaire</th>
                  <th className="py-4 px-6 text-right">Part de Coût / Unité LP</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {decompositions.map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-secondary/15 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{d.code}</td>
                    <td className="py-4 px-6 font-medium text-foreground">{d.libelleElement}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${
                        d.section === 'MAIN D\'OEUVRE' ? 'bg-blue-500/10 text-blue-500' :
                        d.section === 'MATERIEL' ? 'bg-purple-500/10 text-purple-500' :
                        d.section === 'MATERIAUX' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {d.section}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground font-medium">{d.unite}</td>
                    <td className="py-4 px-6 text-center text-muted-foreground font-medium">{d.uniteControle}</td>
                    <td className="py-4 px-6 text-right font-medium text-muted-foreground">{d.quantite}</td>
                    <td className="py-4 px-6 text-right font-medium text-foreground">{formatterEuros(d.prixUnitaire)}</td>
                    <td className="py-4 px-6 text-right font-bold text-foreground">{formatterEuros(d.montant)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="p-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sum footer */}
          <div className="bg-amber-500/5 border-t border-border px-6 py-4 flex items-center justify-between">
            <span className="font-semibold text-amber-600 flex items-center gap-1.5">
              <Calculator size={18} />
              Prix Unitaire de Production (PU Prod) :
            </span>
            <span className="text-xl font-bold text-amber-600">
              {formatterEuros(totalCalculatedPU)} / {selectedLp?.unite || 'u'}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center">
          <LineChart className="mx-auto text-muted-foreground mb-4" size={40} />
          <h3 className="font-bold text-lg mb-1">Aucune décomposition</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Aucun élément (matériaux, main d'œuvre) n'a encore été saisi pour cette tâche de production.
          </p>
        </div>
      )}

      {/* Modal - Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg p-6 rounded-2xl shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4">
              {editingDecomp ? 'Modifier l’Élément' : 'Nouvel Élément de Décomposition'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Code Ressource *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ex: DEC-1011-01"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Section de Coût *</label>
                  <select
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                  >
                    <option value="">Sélectionner une section</option>
                    <option value="MAIN D'OEUVRE">MAIN D'OEUVRE</option>
                    <option value="MATERIAUX">MATERIAUX</option>
                    <option value="MATERIEL">MATERIEL</option>
                    <option value="SOUS-TRAITANCE">SOUS-TRAITANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Désignation Élément *</label>
                <input
                  type="text"
                  required
                  value={formData.libelleElement}
                  onChange={(e) => setFormData({ ...formData, libelleElement: e.target.value })}
                  placeholder="ex: Ciment CPJ45, Compagnon coffreur..."
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Unité Ressource *</label>
                  <input
                    type="text"
                    required
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    placeholder="ex: kg, h, L, m3"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Unité de Contrôle Chantier *</label>
                  <input
                    type="text"
                    required
                    value={formData.uniteControle}
                    onChange={(e) => setFormData({ ...formData, uniteControle: e.target.value })}
                    placeholder="ex: h, sac, toupie"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Quantité (Rendement par unité LP) *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tarif Unitaire HT (DH) *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.prixUnitaire}
                    onChange={(e) => setFormData({ ...formData, prixUnitaire: e.target.value })}
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
export default Decompositions;
