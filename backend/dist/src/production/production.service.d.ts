import { PrismaService } from '../common/prisma.service';
import { CreateLibelleProductionDto, UpdateLibelleProductionDto, CreateBulkLibelleProductionDto } from './production.dto';
export declare class LibelleProductionService {
    private prisma;
    constructor(prisma: PrismaService);
    private syncProductionCost;
    createBulk(createBulkDto: CreateBulkLibelleProductionDto, userId: string): Promise<{
        message: string;
        errors: string[];
    }>;
    create(createLibelleProductionDto: CreateLibelleProductionDto, userId: string): Promise<{
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
    findAll(userId: string, ouvrageId?: string, search?: string, page?: number, limit?: number): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string, userId: string): Promise<any>;
    update(id: string, updateLibelleProductionDto: UpdateLibelleProductionDto, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
    recalculateProductionCost(id: string): Promise<void>;
}
