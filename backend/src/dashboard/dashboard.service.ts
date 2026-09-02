import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const [marchesCount, seriesCount, ouvragesCount, libellesCount] = await Promise.all([
      this.prisma.marche.count({ where: { userId } }),
      this.prisma.serie.count({ where: { marche: { userId } } }),
      this.prisma.ouvrage.count({ where: { serie: { marche: { userId } } } }),
      this.prisma.libelleProduction.count({ where: { ouvrage: { serie: { marche: { userId } } } } }),
    ]);

    // Calculs globaux basés sur les Libellés de Production
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

    // Récupérer le détail des marchés pour le graphique comparatif
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

    // Répartition des coûts par Section dans les décompositions
    const decompositions = await this.prisma.decomposition.findMany({
      where: { libelleProduction: { ouvrage: { serie: { marche: { userId } } } } },
      include: {
        libelleProduction: {
          select: { quantite: true },
        },
      },
    });

    const sectionsMap: { [key: string]: number } = {};
    decompositions.forEach((d) => {
      const section = d.section || 'AUTRE';
      // Le coût de cet élément de décomposition multiplié par la quantité totale du Libellé de Production
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
}
