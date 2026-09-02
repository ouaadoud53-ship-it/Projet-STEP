"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(userId) {
        const [marchesCount, seriesCount, ouvragesCount, libellesCount] = await Promise.all([
            this.prisma.marche.count({ where: { userId } }),
            this.prisma.serie.count({ where: { marche: { userId } } }),
            this.prisma.ouvrage.count({ where: { serie: { marche: { userId } } } }),
            this.prisma.libelleProduction.count({ where: { ouvrage: { serie: { marche: { userId } } } } }),
        ]);
        const aggregates = await this.prisma.libelleProduction.aggregate({
            where: { ouvrage: { serie: { marche: { userId } } } },
            _sum: {
                pptMarcheHT: true,
                pptProduction: true,
            },
        });
        const totalPrixVente = aggregates._sum.pptMarcheHT || 0;
        const totalCoutProduction = aggregates._sum.pptProduction || 0;
        const totalMarge = totalPrixVente - totalCoutProduction;
        const rentabiliteGlobale = totalPrixVente > 0 ? (totalMarge / totalPrixVente) * 100 : 0;
        const marches = await this.prisma.marche.findMany({
            where: { userId },
            include: {
                series: {
                    include: {
                        ouvrages: {
                            include: {
                                libellesProduction: true,
                            },
                        },
                    },
                },
            },
        });
        const marcheDetails = marches.map((m) => {
            let salePrice = 0;
            let costPrice = 0;
            m.series.forEach((s) => {
                s.ouvrages.forEach((o) => {
                    o.libellesProduction.forEach((l) => {
                        salePrice += l.pptMarcheHT || 0;
                        costPrice += l.pptProduction || 0;
                    });
                });
            });
            const margin = salePrice - costPrice;
            const rentability = salePrice > 0 ? (margin / salePrice) * 100 : 0;
            return {
                id: m.id,
                codeAffaire: m.codeAffaire,
                maitreOuvrage: m.maitreOuvrage,
                etat: m.etat,
                prixVente: salePrice,
                coutProduction: costPrice,
                marge: margin,
                rentabilite: parseFloat(rentability.toFixed(2)),
            };
        });
        const decompositions = await this.prisma.decomposition.findMany({
            where: { libelleProduction: { ouvrage: { serie: { marche: { userId } } } } },
            include: {
                libelleProduction: {
                    select: { quantite: true },
                },
            },
        });
        const sectionsMap = {};
        decompositions.forEach((d) => {
            const section = d.section || 'AUTRE';
            const elementTotalCost = d.montant * (d.libelleProduction?.quantite || 0);
            sectionsMap[section] = (sectionsMap[section] || 0) + elementTotalCost;
        });
        const coutsParSection = Object.keys(sectionsMap).map((section) => ({
            name: section,
            value: parseFloat(sectionsMap[section].toFixed(2)),
        }));
        return {
            counts: {
                marches: marchesCount,
                series: seriesCount,
                ouvrages: ouvragesCount,
                libelles: libellesCount,
            },
            financials: {
                totalPrixVente: parseFloat(totalPrixVente.toFixed(2)),
                totalCoutProduction: parseFloat(totalCoutProduction.toFixed(2)),
                totalMarge: parseFloat(totalMarge.toFixed(2)),
                rentabiliteGlobale: parseFloat(rentabiliteGlobale.toFixed(2)),
            },
            chartMarches: marcheDetails,
            chartSections: coutsParSection,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map