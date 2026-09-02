export declare class CreateLibelleProductionDto {
    code: string;
    numeroPrixUnitaire: string;
    cleRepartition: string;
    libelleProduction: string;
    unite: string;
    quantite: number;
    puMarcheHT: number;
    puRevientReference: number;
    ouvrageId: string;
}
export declare class UpdateLibelleProductionDto {
    code?: string;
    numeroPrixUnitaire?: string;
    cleRepartition?: string;
    libelleProduction?: string;
    unite?: string;
    quantite?: number;
    puMarcheHT?: number;
    puRevientReference?: number;
    ouvrageId?: string;
}
export declare class CreateBulkLibelleProductionDto {
    items: CreateLibelleProductionDto[];
}
