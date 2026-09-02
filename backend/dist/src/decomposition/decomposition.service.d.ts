import { PrismaService } from '../common/prisma.service';
import { CreateDecompositionDto, UpdateDecompositionDto } from './decomposition.dto';
import { LibelleProductionService } from '../production/production.service';
export declare class DecompositionService {
    private prisma;
    private productionService;
    constructor(prisma: PrismaService, productionService: LibelleProductionService);
    create(createDto: CreateDecompositionDto, userId: string): Promise<{
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
    findAll(userId: string, libelleProductionId?: string, search?: string, page?: number, limit?: number): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, updateDto: UpdateDecompositionDto, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
