import { LibelleProductionService } from './production.service';
import { CreateLibelleProductionDto, UpdateLibelleProductionDto, CreateBulkLibelleProductionDto } from './production.dto';
export declare class LibelleProductionController {
    private readonly productionService;
    constructor(productionService: LibelleProductionService);
    createBulk(req: any, createBulkDto: CreateBulkLibelleProductionDto): Promise<{
        message: string;
        errors: string[];
    }>;
    create(req: any, createDto: CreateLibelleProductionDto): Promise<{
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
    }>;
    findAll(req: any, ouvrageId?: string, search?: string, page?: string, limit?: string): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(req: any, id: string): Promise<any>;
    update(req: any, id: string, updateDto: UpdateLibelleProductionDto): Promise<{
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
    }>;
    remove(req: any, id: string): Promise<{
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
    }>;
}
