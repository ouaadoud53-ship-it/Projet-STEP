import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(req: any): Promise<{
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
