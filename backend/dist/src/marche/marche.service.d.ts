import { PrismaService } from '../common/prisma.service';
import { CreateMarcheDto, UpdateMarcheDto, EtatMarche } from './marche.dto';
export declare class MarcheService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMarcheDto: CreateMarcheDto, userId: string): Promise<{
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
    }>;
    findAll(userId: string, search?: string, etat?: EtatMarche, page?: number, limit?: number): Promise<{
        items: {
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
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string, userId: string): Promise<{
        series: {
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
        }[];
    } & {
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
    }>;
    update(id: string, updateMarcheDto: UpdateMarcheDto, userId: string): Promise<{
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
    }>;
    remove(id: string, userId: string): Promise<{
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
    }>;
}
