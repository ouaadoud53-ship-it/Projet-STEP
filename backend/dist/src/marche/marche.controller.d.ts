import { MarcheService } from './marche.service';
import { CreateMarcheDto, UpdateMarcheDto, EtatMarche } from './marche.dto';
export declare class MarcheController {
    private readonly marcheService;
    constructor(marcheService: MarcheService);
    create(req: any, createMarcheDto: CreateMarcheDto): Promise<{
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
    findAll(req: any, search?: string, etat?: EtatMarche, page?: string, limit?: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateMarcheDto: UpdateMarcheDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
