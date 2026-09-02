import { PrismaService } from '../common/prisma.service';
import { CreateSerieDto, UpdateSerieDto } from './serie.dto';
export declare class SerieService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSerieDto: CreateSerieDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serie: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        marcheId: string;
    }>;
    findAll(userId: string, marcheId?: string, search?: string, page?: number, limit?: number): Promise<{
        items: ({
            marche: {
                codeAffaire: string;
                numeroMarche: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            serie: string;
            unite: string;
            quantite: number;
            puMarcheHT: number;
            pptMarcheHT: number;
            marcheId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string, userId: string): Promise<{
        marche: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            codeAffaire: string;
            numeroMarche: string;
            maitreOuvrage: string;
            partenaire: string;
            dateOSCommencement: Date;
            delaiProjetMois: number;
            etat: string;
            userId: string;
        };
        ouvrages: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serie: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        marcheId: string;
    }>;
    update(id: string, updateSerieDto: UpdateSerieDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serie: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        marcheId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        serie: string;
        unite: string;
        quantite: number;
        puMarcheHT: number;
        pptMarcheHT: number;
        marcheId: string;
    }>;
}
