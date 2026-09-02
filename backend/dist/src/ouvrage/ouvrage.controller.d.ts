import { OuvrageService } from './ouvrage.service';
import { CreateOuvrageDto, UpdateOuvrageDto } from './ouvrage.dto';
export declare class OuvrageController {
    private readonly ouvrageService;
    constructor(ouvrageService: OuvrageService);
    create(req: any, createOuvrageDto: CreateOuvrageDto): Promise<{
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
    findAll(req: any, serieId?: string, search?: string, page?: string, limit?: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateOuvrageDto: UpdateOuvrageDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
