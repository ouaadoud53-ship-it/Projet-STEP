export type EtatMarche = 'PREPARATION' | 'EN_COURS' | 'TERMINE' | 'CLOTURE';

export interface Marche {
  id: string;
  codeAffaire: string;
  numeroMarche: string;
  maitreOuvrage: string;
  partenaire: string;
  dateOSCommencement: string;
  delaiProjetMois: number;
  etat: EtatMarche;
  createdAt: string;
  updatedAt: string;
  series?: Serie[];
}

export interface Serie {
  id: string;
  code: string;
  serie: string;
  unite: string;
  quantite: number;
  puMarcheHT: number;
  pptMarcheHT: number;
  marcheId: string;
  marche?: {
    codeAffaire: string;
    numeroMarche: string;
  };
  ouvrages?: Ouvrage[];
  createdAt: string;
  updatedAt: string;
}

export interface Ouvrage {
  id: string;
  code: string;
  numeroPrixBordereau: string;
  ouvrage: string;
  unite: string;
  quantite: number;
  puMarcheHT: number;
  pptMarcheHT: number;
  puRevientReference: number;
  pptRevientReference: number;
  serieId: string;
  serie?: {
    code: string;
    serie: string;
    marche?: {
      codeAffaire: string;
      numeroMarche: string;
    };
  };
  libellesProduction?: LibelleProduction[];
  createdAt: string;
  updatedAt: string;
}

export interface LibelleProduction {
  id: string;
  code: string;
  numeroPrixUnitaire: string;
  cleRepartition: string;
  libelleProduction: string;
  unite: string;
  quantite: number;
  puMarcheHT: number;
  pptMarcheHT: number;
  puRevientReference: number;
  pptRevientReference: number;
  puProduction: number;
  pptProduction: number;
  ouvrageId: string;
  ouvrage?: {
    code: string;
    ouvrage: string;
    serie?: {
      code: string;
      serie: string;
    };
  };
  decompositions?: Decomposition[];
  createdAt: string;
  updatedAt: string;
}

export interface Decomposition {
  id: string;
  code: string;
  unite: string;
  libelleElement: string;
  uniteControle: string;
  section: string;
  quantite: number;
  prixUnitaire: number;
  montant: number;
  libelleProductionId: string;
  libelleProduction?: {
    code: string;
    libelleProduction: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  counts: {
    marches: number;
    series: number;
    ouvrages: number;
    libelles: number;
  };
  financials: {
    totalPrixVente: number;
    totalCoutProduction: number;
    totalMarge: number;
    rentabiliteGlobale: number;
  };
  chartMarches: Array<{
    id: string;
    codeAffaire: string;
    maitreOuvrage: string;
    etat: string;
    prixVente: number;
    coutProduction: number;
    marge: number;
    rentabilite: number;
  }>;
  chartSections: Array<{
    name: string;
    value: number;
  }>;
}
