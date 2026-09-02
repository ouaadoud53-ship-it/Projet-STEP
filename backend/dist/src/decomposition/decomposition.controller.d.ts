import { DecompositionService } from './decomposition.service';
import { CreateDecompositionDto, UpdateDecompositionDto } from './decomposition.dto';
export declare class DecompositionController {
    private readonly decompositionService;
    constructor(decompositionService: DecompositionService);
    create(req: any, createDto: CreateDecompositionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        libelleElement: string;
        uniteControle: string;
        section: string;
        prixUnitaire: number;
        montant: number;
        libelleProductionId: string;
    }>;
    findAll(req: any, libelleProductionId?: string, search?: string, page?: string, limit?: string): Promise<{
        items: ({
            libelleProduction: {
                code: string;
                libelleProduction: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            unite: string;
            quantite: number;
            libelleElement: string;
            uniteControle: string;
            section: string;
            prixUnitaire: number;
            montant: number;
            libelleProductionId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(req: any, id: string): Promise<{
        libelleProduction: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            unite: string;
            quantite: number;
            puMarcheHT: number;
            pptMarcheHT: number;
            puRevientReference: number;
            pptRevientReference: number;
            numeroPrixUnitaire: string;
            cleRepartition: string;
            libelleProduction: string;
            puProduction: number;
            pptProduction: number;
            ouvrageId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        libelleElement: string;
        uniteControle: string;
        section: string;
        prixUnitaire: number;
        montant: number;
        libelleProductionId: string;
    }>;
    update(req: any, id: string, updateDto: UpdateDecompositionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        libelleElement: string;
        uniteControle: string;
        section: string;
        prixUnitaire: number;
        montant: number;
        libelleProductionId: string;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        libelleElement: string;
        uniteControle: string;
        section: string;
        prixUnitaire: number;
        montant: number;
        libelleProductionId: string;
    }>;
}
