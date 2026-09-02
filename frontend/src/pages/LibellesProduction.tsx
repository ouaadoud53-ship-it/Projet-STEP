import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { productionService, ouvrageService } from '../services/api';
import { LibelleProduction, Ouvrage } from '../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Calculator,
  Info,
  Upload
} from 'lucide-react';
import { showError, showSuccess } from '../utils/alerts';

export const LibellesProduction: React.FC = () => {
  const [items, setItems] = useState<LibelleProduction[]>([]);
  const [ouvrages, setOuvrages] = useState<Ouvrage[]>([]);
  const [selectedOuvrageId, setSelectedOuvrageId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibelleProduction | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    numeroPrixUnitaire: '',
    cleRepartition: '',
    libelleProduction: '',
    unite: '',
    quantite: '',
    puMarcheHT: '',
    puRevientReference: '',
    ouvrageId: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          showError('Fichier invalide', 'Le fichier est vide ou mal formaté.');
          return;
        }

        const itemsToImport = data.map((row: any) => {
          let rowOuvrageId = selectedOuvrageId;
          
          if (row['Code Ouvrage']) {
            const foundOuvrage = ouvrages.find(o => o.code === row['Code Ouvrage']);
            if (foundOuvrage) rowOuvrageId = foundOuvrage.id;
          }

          return {
            code: row['Code'] || '',
            numeroPrixUnitaire: row['N° Prix U'] || '',
            cleRepartition: row['Clé Rép.'] || 'GC',
            libelleProduction: row['Libellé Production'] || '',
            unite: row['Unité'] || '',
            quantite: Number(row['Quantité']) || 0,
            puMarcheHT: Number(row['PU Marché HT']) || 0,
            puRevientReference: Number(row['PU Revient Réf']) || 0,
            ouvrageId: rowOuvrageId
          };
        });

        const validItems = itemsToImport.filter(item => item.code && item.libelleProduction && item.ouvrageId);

        if (validItems.length === 0) {
          showError('Aucune ligne valide', "Vérifiez que les colonnes 'Code', 'Libellé Production' sont remplies et qu'un ouvrage est défini (filtre ou colonne 'Code Ouvrage').");
          return;
        }

        const res = await productionService.createBulk(validItems);
        showSuccess('Import terminé', res.message + (res.errors ? "\nErreurs:\n" + res.errors.join("\n") : ""));
        fetchItems();
      } catch (err: any) {
        console.error(err);
        showError('Import impossible', "Erreur lors de l'importation du fichier.");
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await productionService.getAll(selectedOuvrageId || undefined, search || undefined);
      setItems(data.items);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des libellés de production.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOuvrages = async () => {
    try {
      const data = await ouvrageService.getAll();
      setOuvrages(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOuvrages();
  }, []);


  useEffect(() => {
    fetchItems();
  }, [selectedOuvrageId, search]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      code: '',
      numeroPrixUnitaire: '',
      cleRepartition: '',
      libelleProduction: '',
      unite: '',
      quantite: '',
      puMarcheHT: '',
      puRevientReference: '',
      ouvrageId: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LibelleProduction) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      numeroPrixUnitaire: item.numeroPrixUnitaire,
      cleRepartition: item.cleRepartition,
      libelleProduction: item.libelleProduction,
      unite: item.unite,
      quantite: item.quantite === 0 ? '' : item.quantite.toString(),
      puMarcheHT: item.puMarcheHT === 0 ? '' : item.puMarcheHT.toString(),
      puRevientReference: item.puRevientReference === 0 ? '' : item.puRevientReference.toString(),
      ouvrageId: item.ouvrageId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantite: Number(formData.quantite),
        puMarcheHT: Number(formData.puMarcheHT),
        puRevientReference: Number(formData.puRevientReference),
      };
      if (editingItem) {
        await productionService.update(editingItem.id, payload);
      } else {
        await productionService.create(payload);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      showError('Enregistrement impossible', err.response?.data?.message || 'Erreur lors de l’enregistrement du libellé de production.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce libellé de production ? Ses sous-détails de décomposition seront supprimés.')) {
      try {
        await productionService.delete(id);
        fetchItems();
      } catch (err) {
        console.error(err);
        showError('Suppression impossible', 'Erreur lors de la suppression.');
      }
    }
  };

  const formatterEuros = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(value);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Bordereau Interne (Libellés Production)</h2>
          <p className="text-muted-foreground">Comparez le budget de vente avec les coûts réels de production.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-secondary/80 transition-all duration-200"
          >
            {importing ? <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
            Importer Excel
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 hover:opacity-90 transition-all duration-200"
          >
            <Plus size={18} />
            Nouveau Libellé Prod
          </button>
          {/* Single import button only (fileInputRef + handleFileUpload) */}
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Rechercher par code, libellé ou numéro de prix..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedOuvrageId}
            onChange={(e) => setSelectedOuvrageId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="">Tous les ouvrages</option>
            {ouvrages.map((o) => (
              <option key={o.id} value={o.id}>
                {o.code} - {o.ouvrage}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Warning */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3 text-sm text-primary">
        <Info size={18} className="mt-0.5 shrink-0" />
        <div>
          <strong>Info Calculs :</strong> Le <span className="underline font-semibold">PU Prod</span> correspond à la somme unitaire des fournitures, mains d'œuvres et matériels saisis dans la page **Décompositions**. Le système compare automatiquement ce coût de production avec le prix de vente du marché.
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
      ) : items.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-medium bg-muted/20">
                  <th className="py-4 px-4">Code</th>
                  <th className="py-4 px-4">N° Prix U</th>
                  <th className="py-4 px-4">Série</th>
                  <th className="py-4 px-4">Clé Rép.</th>
                  <th className="py-4 px-4">Libellé Production</th>
                  <th className="py-4 px-4 text-center">Unité</th>
                  <th className="py-4 px-4 text-right">Qté</th>
                  <th className="py-4 px-4 text-right">PU Marché HT</th>
                  <th className="py-4 px-4 text-right">PU Prod</th>
                  <th className="py-4 px-4 text-right">PPT Prod</th>
                  <th className="py-4 px-4 text-right">Marge Unitaire</th>
                  <th className="py-4 px-4 text-right">Rentabilité</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((lp) => {
                  const margeUnitaire = lp.puMarcheHT - lp.puProduction;
                  const rentabilite = lp.puMarcheHT > 0 ? (margeUnitaire / lp.puMarcheHT) * 100 : 0;

                  return (
                    <tr key={lp.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                      <td className="py-4 px-4 font-semibold text-foreground">{lp.code}</td>
                      <td className="py-4 px-4 text-muted-foreground">{lp.numeroPrixUnitaire}</td>
                      <td className="py-4 px-4 text-muted-foreground font-medium">{lp.ouvrage?.serie?.serie ?? lp.ouvrage?.serie?.code ?? '-'}</td>
                      <td className="py-4 px-4 text-muted-foreground font-medium">{lp.cleRepartition}</td>
                      <td className="py-4 px-4 font-semibold text-foreground max-w-xs truncate">{lp.libelleProduction}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground font-medium">{lp.unite}</td>
                      <td className="py-4 px-4 text-right font-medium text-muted-foreground">{lp.quantite}</td>
                      <td className="py-4 px-4 text-right font-semibold text-foreground">{formatterEuros(lp.puMarcheHT)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-amber-500">{formatterEuros(lp.puProduction)}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground font-semibold">{formatterEuros(lp.pptProduction)}</td>
                      <td className={`py-4 px-4 text-right font-bold ${margeUnitaire >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatterEuros(margeUnitaire)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          rentabilite > 15 ? 'bg-emerald-500/10 text-emerald-500' :
                          rentabilite >= 0 ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {rentabilite.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(lp)}
                            className="p-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(lp.id)}
                            className="p-1.5 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center">
          <Calculator className="mx-auto text-muted-foreground mb-4" size={40} />
          <h3 className="font-bold text-lg mb-1">Aucun libellé de production</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Créez un nouveau libellé de production pour commencer à chiffrer vos coûts internes.
          </p>
        </div>
      )}

      {/* Modal - Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg p-6 rounded-2xl shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4">
              {editingItem ? 'Modifier le Libellé Prod' : 'Nouveau Libellé Prod'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ex: LP-1011"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">N° Prix U *</label>
                  <input
                    type="text"
                    required
                    value={formData.numeroPrixUnitaire}
                    onChange={(e) => setFormData({ ...formData, numeroPrixUnitaire: e.target.value })}
                    placeholder="ex: PU-1.1"
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Clé Rép. *</label>
                  <select
                    required
                    value={formData.cleRepartition}
                    onChange={(e) => setFormData({ ...formData, cleRepartition: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner</option>
                    <option value="GC">GC</option>
                    <option value="ETU">ETU</option>
                    <option value="ELE">ELE</option>
                    <option value="EQ">EQ</option>
                    <option value="MES">MES</option>
                    <option value="EXP">EXP</option>
                    <option value="EC">EC</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Ouvrage Contractuel lié *</label>
                <select
                  required
                  value={formData.ouvrageId}
                  onChange={(e) => setFormData({ ...formData, ouvrageId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="">Sélectionner un ouvrage</option>
                  {ouvrages.map((o) => (
                    <option key={o.id} value={o.id}>
                      [{o.code}] {o.ouvrage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Libellé Production *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.libelleProduction}
                  onChange={(e) => setFormData({ ...formData, libelleProduction: e.target.value })}
                  placeholder="Désignation interne de la tâche de production..."
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
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Quantité estimée *</label>
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
export default LibellesProduction;
