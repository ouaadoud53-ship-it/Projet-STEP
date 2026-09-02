import React, { useEffect, useState } from 'react';
import { marcheService, serieService, ouvrageService, productionService, decompositionService } from '../services/api';
import { Marche, Serie, Ouvrage, LibelleProduction, Decomposition } from '../types';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';

export const Hierarchie: React.FC = () => {
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedMarkets, setExpandedMarkets] = useState<Record<string, boolean>>({});
  const [seriesByMarche, setSeriesByMarche] = useState<Record<string, Serie[]>>({});
  const [loadingSeriesByMarche, setLoadingSeriesByMarche] = useState<Record<string, boolean>>({});

  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const [ouvragesBySerie, setOuvragesBySerie] = useState<Record<string, Ouvrage[]>>({});
  const [loadingOuvragesBySerie, setLoadingOuvragesBySerie] = useState<Record<string, boolean>>({});

  const [expandedOuvrages, setExpandedOuvrages] = useState<Record<string, boolean>>({});
  const [libellesByOuvrage, setLibellesByOuvrage] = useState<Record<string, LibelleProduction[]>>({});
  const [loadingLibellesByOuvrage, setLoadingLibellesByOuvrage] = useState<Record<string, boolean>>({});

  const [expandedLibelles, setExpandedLibelles] = useState<Record<string, boolean>>({});
  const [decompsByLibelle, setDecompsByLibelle] = useState<Record<string, Decomposition[]>>({});
  const [loadingDecompsByLibelle, setLoadingDecompsByLibelle] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        setLoading(true);
        const data = await marcheService.getAll(undefined, undefined, 1, 100);
        setMarches(data.items);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des marchés.');
      } finally {
        setLoading(false);
      }
    };
    fetchMarches();
  }, []);

  const fetchSeries = async (marcheId: string) => {
    if (seriesByMarche[marcheId] || loadingSeriesByMarche[marcheId]) return;
    try {
      setLoadingSeriesByMarche((prev) => ({ ...prev, [marcheId]: true }));
      const data = await serieService.getAll(marcheId, undefined, 1, 100);
      setSeriesByMarche((prev) => ({ ...prev, [marcheId]: data.items }));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des séries.');
    } finally {
      setLoadingSeriesByMarche((prev) => ({ ...prev, [marcheId]: false }));
    }
  };

  const fetchOuvrages = async (serieId: string) => {
    if (ouvragesBySerie[serieId] || loadingOuvragesBySerie[serieId]) return;
    try {
      setLoadingOuvragesBySerie((prev) => ({ ...prev, [serieId]: true }));
      const data = await ouvrageService.getAll(serieId, undefined, 1, 100);
      setOuvragesBySerie((prev) => ({ ...prev, [serieId]: data.items }));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des ouvrages.');
    } finally {
      setLoadingOuvragesBySerie((prev) => ({ ...prev, [serieId]: false }));
    }
  };

  const fetchLibelles = async (ouvrageId: string) => {
    if (libellesByOuvrage[ouvrageId] || loadingLibellesByOuvrage[ouvrageId]) return;
    try {
      setLoadingLibellesByOuvrage((prev) => ({ ...prev, [ouvrageId]: true }));
      const data = await productionService.getAll(ouvrageId, undefined, 1, 100);
      setLibellesByOuvrage((prev) => ({ ...prev, [ouvrageId]: data.items }));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des libellés de production.');
    } finally {
      setLoadingLibellesByOuvrage((prev) => ({ ...prev, [ouvrageId]: false }));
    }
  };

  const fetchDecomps = async (libelleId: string) => {
    if (decompsByLibelle[libelleId] || loadingDecompsByLibelle[libelleId]) return;
    try {
      setLoadingDecompsByLibelle((prev) => ({ ...prev, [libelleId]: true }));
      const data = await decompositionService.getAll(libelleId, undefined, 1, 100);
      setDecompsByLibelle((prev) => ({ ...prev, [libelleId]: data.items }));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des décompositions.');
    } finally {
      setLoadingDecompsByLibelle((prev) => ({ ...prev, [libelleId]: false }));
    }
  };

  const toggleMarket = (marcheId: string) => {
    const expanded = !!expandedMarkets[marcheId];
    setExpandedMarkets((prev) => ({ ...prev, [marcheId]: !expanded }));
    if (!expanded) {
      fetchSeries(marcheId);
    }
  };

  const toggleSeries = (serieId: string) => {
    const expanded = !!expandedSeries[serieId];
    setExpandedSeries((prev) => ({ ...prev, [serieId]: !expanded }));
    if (!expanded) {
      fetchOuvrages(serieId);
    }
  };

  const toggleOuvrage = (ouvrageId: string) => {
    const expanded = !!expandedOuvrages[ouvrageId];
    setExpandedOuvrages((prev) => ({ ...prev, [ouvrageId]: !expanded }));
    if (!expanded) {
      fetchLibelles(ouvrageId);
    }
  };

  const toggleLibelle = (libelleId: string) => {
    const expanded = !!expandedLibelles[libelleId];
    setExpandedLibelles((prev) => ({ ...prev, [libelleId]: !expanded }));
    if (!expanded) {
      fetchDecomps(libelleId);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Arborescence des marchés</h2>
        <p className="text-muted-foreground">Consultez les marchés et naviguez vers les séries, ouvrages, libellés de production et décompositions associés.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : marches.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl text-center">
          <p className="text-muted-foreground">Aucun marché trouvé.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {marches.map((marche) => {
            const series = seriesByMarche[marche.id] || [];
            const isMarketExpanded = !!expandedMarkets[marche.id];
            return (
              <div key={marche.id} className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-foreground">{marche.codeAffaire} · Marché {marche.numeroMarche}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>{marche.maitreOuvrage}</span>
                      <span>{marche.partenaire}</span>
                      <span>{new Date(marche.dateOSCommencement).toLocaleDateString('fr-FR')}</span>
                      <span>{marche.delaiProjetMois} mois</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMarket(marche.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-all duration-200"
                  >
                    {isMarketExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {isMarketExpanded ? 'Masquer les séries' : 'Voir les séries'}
                  </button>
                </div>

                {isMarketExpanded && (
                  <div className="border-t border-border bg-background/70 p-4 sm:p-6 space-y-4">
                    {loadingSeriesByMarche[marche.id] ? (
                      <div className="text-sm text-muted-foreground">Chargement des séries...</div>
                    ) : series.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Aucune série rattachée à ce marché.</div>
                    ) : (
                      <div className="space-y-4">
                        {series.map((serie) => {
                          const ouvrages = ouvragesBySerie[serie.id] || [];
                          const isSerieExpanded = !!expandedSeries[serie.id];
                          return (
                            <div key={serie.id} className="bg-card border border-border rounded-3xl p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="font-semibold text-foreground">{serie.code} · {serie.serie}</div>
                                  <div className="text-sm text-muted-foreground">Unité {serie.unite} · Quantité {serie.quantite}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleSeries(serie.id)}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-all duration-200"
                                >
                                  {isSerieExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                  {isSerieExpanded ? 'Masquer ouvrages' : 'Voir ouvrages'}
                                </button>
                              </div>

                              {isSerieExpanded && (
                                <div className="mt-4 space-y-3">
                                  {loadingOuvragesBySerie[serie.id] ? (
                                    <div className="text-sm text-muted-foreground">Chargement des ouvrages...</div>
                                  ) : ouvrages.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">Aucun ouvrage pour cette série.</div>
                                  ) : (
                                    <div className="space-y-3">
                                      {ouvrages.map((ouvrage) => {
                                        const libelles = libellesByOuvrage[ouvrage.id] || [];
                                        const isOuvrageExpanded = !!expandedOuvrages[ouvrage.id];
                                        return (
                                          <div key={ouvrage.id} className="bg-background border border-border rounded-3xl p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                              <div className="space-y-1">
                                                <div className="font-semibold text-foreground">{ouvrage.code} · {ouvrage.ouvrage}</div>
                                                <div className="text-sm text-muted-foreground">Unité {ouvrage.unite} · Qté {ouvrage.quantite}</div>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => toggleOuvrage(ouvrage.id)}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-all duration-200"
                                              >
                                                {isOuvrageExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                {isOuvrageExpanded ? 'Masquer libellés' : 'Voir libellés'}
                                              </button>
                                            </div>

                                            {isOuvrageExpanded && (
                                              <div className="mt-4 space-y-3">
                                                {loadingLibellesByOuvrage[ouvrage.id] ? (
                                                  <div className="text-sm text-muted-foreground">Chargement des libellés de production...</div>
                                                ) : libelles.length === 0 ? (
                                                  <div className="text-sm text-muted-foreground">Aucun libellé de production pour cet ouvrage.</div>
                                                ) : (
                                                  <div className="space-y-3">
                                                    {libelles.map((libelle) => {
                                                      const decomps = decompsByLibelle[libelle.id] || [];
                                                      const isLibelleExpanded = !!expandedLibelles[libelle.id];
                                                      return (
                                                        <div key={libelle.id} className="bg-card border border-border rounded-3xl p-4">
                                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            <div className="space-y-1">
                                                              <div className="font-semibold text-foreground">{libelle.code} · {libelle.libelleProduction}</div>
                                                              <div className="text-sm text-muted-foreground">Unité {libelle.unite} · Qté {libelle.quantite}</div>
                                                            </div>
                                                            <button
                                                              type="button"
                                                              onClick={() => toggleLibelle(libelle.id)}
                                                              className="inline-flex items-center gap-2 rounded-2xl border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-all duration-200"
                                                            >
                                                              {isLibelleExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                              {isLibelleExpanded ? 'Masquer décompositions' : 'Voir décompositions'}
                                                            </button>
                                                          </div>

                                                          {isLibelleExpanded && (
                                                            <div className="mt-4 space-y-2">
                                                              {loadingDecompsByLibelle[libelle.id] ? (
                                                                <div className="text-sm text-muted-foreground">Chargement des décompositions...</div>
                                                              ) : decomps.length === 0 ? (
                                                                <div className="text-sm text-muted-foreground">Aucune décomposition pour ce libellé de production.</div>
                                                              ) : (
                                                                <div className="space-y-2 border-t border-border pt-4">
                                                                  {decomps.map((decomp) => (
                                                                    <div key={decomp.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl bg-background/80 border border-border p-3">
                                                                      <div>
                                                                        <div className="text-sm text-muted-foreground">Code</div>
                                                                        <div className="font-medium text-foreground">{decomp.code}</div>
                                                                      </div>
                                                                      <div>
                                                                        <div className="text-sm text-muted-foreground">Désignation</div>
                                                                        <div className="font-medium text-foreground">{decomp.libelleElement}</div>
                                                                      </div>
                                                                      <div>
                                                                        <div className="text-sm text-muted-foreground">Section</div>
                                                                        <div className="font-medium text-foreground">{decomp.section}</div>
                                                                      </div>
                                                                      <div>
                                                                        <div className="text-sm text-muted-foreground">Quantité</div>
                                                                        <div className="font-medium text-foreground">{decomp.quantite} {decomp.unite}</div>
                                                                      </div>
                                                                    </div>
                                                                  ))}
                                                                </div>
                                                              )}
                                                            </div>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
