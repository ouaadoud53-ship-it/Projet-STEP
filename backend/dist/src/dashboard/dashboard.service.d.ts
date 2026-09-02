import { PrismaService } from '../common/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(userId: string): Promise<{
        counts: {
            marches: number;
            series: number;
            ouvrages: number;
            libelles: number;
        };
        financials: {
            totalPrixVente: number;
            totalCoutProduction: number;
            totalMarge: number;
            rentabiliteGlobale: number;
        };
        chartMarches: {
            id: string;
            codeAffaire: string;
            maitreOuvrage: string;
            etat: string;
            prixVente: number;
            coutProduction: number;
            marge: number;
            rentabilite: number;
        }[];
        chartSections: {
            name: string;
            value: number;
        }[];
    }>;
}
