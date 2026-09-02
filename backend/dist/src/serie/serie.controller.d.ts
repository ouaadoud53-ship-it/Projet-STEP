import { SerieService } from './serie.service';
import { CreateSerieDto, UpdateSerieDto } from './serie.dto';
export declare class SerieController {
    private readonly serieService;
    constructor(serieService: SerieService);
    create(req: any, createSerieDto: CreateSerieDto): Promise<{
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
    findAll(req: any, marcheId?: string, search?: string, page?: string, limit?: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateSerieDto: UpdateSerieDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
