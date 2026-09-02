import axios from 'axios';
import {
  Marche,
  Serie,
  Ouvrage,
  LibelleProduction,
  Decomposition,
  DashboardStats,
  EtatMarche
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/dashboard/stats');
    return data;
  },
};

export const marcheService = {
  getAll: async (search?: string, etat?: EtatMarche, page = 1, limit = 10): Promise<{ items: Marche[]; total: number; pages: number }> => {
    const { data } = await api.get('/marches', {
      params: { search, etat, page, limit },
    });
    return data;
  },
  getById: async (id: string): Promise<Marche> => {
    const { data } = await api.get<Marche>(`/marches/${id}`);
    return data;
  },
  create: async (marche: Omit<Marche, 'id' | 'createdAt' | 'updatedAt'>): Promise<Marche> => {
    const { data } = await api.post<Marche>('/marches', marche);
    return data;
  },
  update: async (id: string, marche: Partial<Marche>): Promise<Marche> => {
    const { data } = await api.patch<Marche>(`/marches/${id}`, marche);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/marches/${id}`);
  },
};

export const serieService = {
  getAll: async (marcheId?: string, search?: string, page = 1, limit = 50): Promise<{ items: Serie[]; total: number; pages: number }> => {
    const { data } = await api.get('/series', {
      params: { marcheId, search, page, limit },
    });
    return data;
  },
  getById: async (id: string): Promise<Serie> => {
    const { data } = await api.get<Serie>(`/series/${id}`);
    return data;
  },
  create: async (serie: Omit<Serie, 'id' | 'pptMarcheHT' | 'createdAt' | 'updatedAt'>): Promise<Serie> => {
    const { data } = await api.post<Serie>('/series', {
      ...serie,
      quantite: Number(serie.quantite),
      puMarcheHT: Number(serie.puMarcheHT),
    });
    return data;
  },
  update: async (id: string, serie: Partial<Serie>): Promise<Serie> => {
    const formatted: any = { ...serie };
    if (serie.quantite !== undefined) formatted.quantite = Number(serie.quantite);
    if (serie.puMarcheHT !== undefined) formatted.puMarcheHT = Number(serie.puMarcheHT);
    
    const { data } = await api.patch<Serie>(`/series/${id}`, formatted);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/series/${id}`);
  },
};

export const ouvrageService = {
  getAll: async (serieId?: string, search?: string, page = 1, limit = 50): Promise<{ items: Ouvrage[]; total: number; pages: number }> => {
    const { data } = await api.get('/ouvrages', {
      params: { serieId, search, page, limit },
    });
    return data;
  },
  getById: async (id: string): Promise<Ouvrage> => {
    const { data } = await api.get<Ouvrage>(`/ouvrages/${id}`);
    return data;
  },
  create: async (ouvrage: Omit<Ouvrage, 'id' | 'pptMarcheHT' | 'pptRevientReference' | 'createdAt' | 'updatedAt'>): Promise<Ouvrage> => {
    const { data } = await api.post<Ouvrage>('/ouvrages', {
      ...ouvrage,
      quantite: Number(ouvrage.quantite),
      puMarcheHT: Number(ouvrage.puMarcheHT),
      puRevientReference: Number(ouvrage.puRevientReference),
    });
    return data;
  },
  update: async (id: string, ouvrage: Partial<Ouvrage>): Promise<Ouvrage> => {
    const formatted: any = { ...ouvrage };
    if (ouvrage.quantite !== undefined) formatted.quantite = Number(ouvrage.quantite);
    if (ouvrage.puMarcheHT !== undefined) formatted.puMarcheHT = Number(ouvrage.puMarcheHT);
    if (ouvrage.puRevientReference !== undefined) formatted.puRevientReference = Number(ouvrage.puRevientReference);

    const { data } = await api.patch<Ouvrage>(`/ouvrages/${id}`, formatted);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/ouvrages/${id}`);
  },
};

export const productionService = {
  getAll: async (ouvrageId?: string, search?: string, page = 1, limit = 50): Promise<{ items: LibelleProduction[]; total: number; pages: number }> => {
    const { data } = await api.get('/production', {
      params: { ouvrageId, search, page, limit },
    });
    return data;
  },
  getById: async (id: string): Promise<LibelleProduction> => {
    const { data } = await api.get<LibelleProduction>(`/production/${id}`);
    return data;
  },
  create: async (lp: Omit<LibelleProduction, 'id' | 'pptMarcheHT' | 'pptRevientReference' | 'puProduction' | 'pptProduction' | 'createdAt' | 'updatedAt'>): Promise<LibelleProduction> => {
    const { data } = await api.post<LibelleProduction>('/production', {
      ...lp,
      cleRepartition: String(lp.cleRepartition),
      quantite: Number(lp.quantite),
      puMarcheHT: Number(lp.puMarcheHT),
      puRevientReference: Number(lp.puRevientReference),
    });
    return data;
  },
  createBulk: async (items: any[]): Promise<{ message: string; errors?: string[] }> => {
    const formattedItems = items.map(lp => ({
      ...lp,
      cleRepartition: String(lp.cleRepartition),
      quantite: Number(lp.quantite),
      puMarcheHT: Number(lp.puMarcheHT),
      puRevientReference: Number(lp.puRevientReference),
    }));
    const { data } = await api.post<{ message: string; errors?: string[] }>('/production/bulk', { items: formattedItems });
    return data;
  },
  update: async (id: string, lp: Partial<LibelleProduction>): Promise<LibelleProduction> => {
    const formatted: any = { ...lp };
    if (lp.cleRepartition !== undefined) formatted.cleRepartition = String(lp.cleRepartition);
    if (lp.quantite !== undefined) formatted.quantite = Number(lp.quantite);
    if (lp.puMarcheHT !== undefined) formatted.puMarcheHT = Number(lp.puMarcheHT);
    if (lp.puRevientReference !== undefined) formatted.puRevientReference = Number(lp.puRevientReference);

    const { data } = await api.patch<LibelleProduction>(`/production/${id}`, formatted);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/production/${id}`);
  },
};

export const decompositionService = {
  getAll: async (libelleProductionId?: string, search?: string, page = 1, limit = 50): Promise<{ items: Decomposition[]; total: number; pages: number }> => {
    const { data } = await api.get('/decompositions', {
      params: { libelleProductionId, search, page, limit },
    });
    return data;
  },
  getById: async (id: string): Promise<Decomposition> => {
    const { data } = await api.get<Decomposition>(`/decompositions/${id}`);
    return data;
  },
  create: async (decomp: Omit<Decomposition, 'id' | 'montant' | 'createdAt' | 'updatedAt'>): Promise<Decomposition> => {
    const { data } = await api.post<Decomposition>('/decompositions', {
      ...decomp,
      quantite: Number(decomp.quantite),
      prixUnitaire: Number(decomp.prixUnitaire),
    });
    return data;
  },
  update: async (id: string, decomp: Partial<Decomposition>): Promise<Decomposition> => {
    const formatted: any = { ...decomp };
    if (decomp.quantite !== undefined) formatted.quantite = Number(decomp.quantite);
    if (decomp.prixUnitaire !== undefined) formatted.prixUnitaire = Number(decomp.prixUnitaire);

    const { data } = await api.patch<Decomposition>(`/decompositions/${id}`, formatted);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/decompositions/${id}`);
  },
};

export default api;
