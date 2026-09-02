import { PrismaService } from '../common/prisma.service';
import { CreateOuvrageDto, UpdateOuvrageDto } from './ouvrage.dto';
export declare class OuvrageService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOuvrageDto: CreateOuvrageDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        numeroPrixBordereau: string;
        ouvrage: string;
        puRevientReference: number;
        pptRevientReference: number;
        serieId: string;
    }>;
    findAll(userId: string, serieId?: string, search?: string, page?: number, limit?: number): Promise<{
        items: ({
            serie: {
                marche: {
                    codeAffaire: string;
                    numeroMarche: string;
                };
                code: string;
                serie: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            unite: string;
            quantite: number;
            puMarcheHT: number;
            pptMarcheHT: number;
            numeroPrixBordereau: string;
            ouvrage: string;
            puRevientReference: number;
            pptRevientReference: number;
            serieId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string, userId: string): Promise<{
        serie: {
            marche: {
                codeAffaire: string;
                numeroMarche: string;
            };
            code: string;
            serie: string;
        };
        libellesProduction: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        numeroPrixBordereau: string;
        ouvrage: string;
        puRevientReference: number;
        pptRevientReference: number;
        serieId: string;
    }>;
    update(id: string, updateOuvrageDto: UpdateOuvrageDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        numeroPrixBordereau: string;
        ouvrage: string;
        puRevientReference: number;
        pptRevientReference: number;
        serieId: string;
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
        numeroPrixBordereau: string;
        ouvrage: string;
        puRevientReference: number;
        pptRevientReference: number;
        serieId: string;
    }>;
}
