import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateLibelleProductionDto, UpdateLibelleProductionDto, CreateBulkLibelleProductionDto } from './production.dto';

@Injectable()
export class LibelleProductionService {
  constructor(private prisma: PrismaService) {}

  private async syncProductionCost(item: any) {
    const decompositions = item.decompositions || [];
    const puProduction = decompositions.reduce((sum: number, decomp: { montant?: number | null }) => sum + (decomp.montant || 0), 0);
    const pptProduction = (item.quantite || 0) * puProduction;

    if (item.puProduction !== puProduction || item.pptProduction !== pptProduction) {
      return this.prisma.libelleProduction.update({
        where: { id: item.id },
        data: {
          puProduction,
          pptProduction,
        },
      });
    }

    return item;
  }

  async createBulk(createBulkDto: CreateBulkLibelleProductionDto, userId: string) {
    let imported = 0;
    const errors: string[] = [];

    for (const item of createBulkDto.items) {
      try {
        await this.create(item, userId);
        imported++;
      } catch (error: any) {
        errors.push(`Erreur sur le code ${item.code}: ${error.message}`);
      }
    }

    return {
      message: `${imported} libellés importés avec succès.`,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async create(createLibelleProductionDto: CreateLibelleProductionDto, userId: string) {
    const ouvrage = await this.prisma.ouvrage.findFirst({
      where: { id: createLibelleProductionDto.ouvrageId, serie: { marche: { userId } } },
    });
    if (!ouvrage) {
      throw new NotFoundException(`Ouvrage not found or unauthorized`);
    }

    const existing = await this.prisma.libelleProduction.findFirst({
      where: {
        ouvrageId: createLibelleProductionDto.ouvrageId,
        code: createLibelleProductionDto.code,
      },
    });
    if (existing) {
      throw new ConflictException(`Code Libellé Production ${createLibelleProductionDto.code} already exists for this ouvrage`);
    }

    const pptMarcheHT = createLibelleProductionDto.quantite * createLibelleProductionDto.puMarcheHT;
    const pptRevientReference = createLibelleProductionDto.quantite * createLibelleProductionDto.puRevientReference;

    return this.prisma.libelleProduction.create({
      data: {
        ...createLibelleProductionDto,
        pptMarcheHT,
        pptRevientReference,
        puProduction: 0,
        pptProduction: 0,
      },
    });
  }

  async findAll(userId: string, ouvrageId?: string, search?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where: any = { ouvrage: { serie: { marche: { userId } } } };

    if (ouvrageId) {
      where.ouvrageId = ouvrageId;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { libelleProduction: { contains: search, mode: 'insensitive' } },
        { numeroPrixUnitaire: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.libelleProduction.findMany({
        where,
        skip,
        take: limit,
        include: {
          ouvrage: {
            select: {
              code: true,
              ouvrage: true,
              serie: { select: { code: true, serie: true } },
            },
          },
          decompositions: {
            select: {
              montant: true,
            },
          },
        },
        orderBy: { code: 'asc' },
      }),
      this.prisma.libelleProduction.count({ where }),
    ]);

    const refreshedItems = await Promise.all(items.map((item) => this.syncProductionCost(item)));

    return {
      items: refreshedItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const item = await this.prisma.libelleProduction.findFirst({
      where: { id, ouvrage: { serie: { marche: { userId } } } },
      include: {
        ouvrage: {
          include: {
            serie: true,
          },
        },
        decompositions: {
          orderBy: { code: 'asc' },
        },
      },
    });
    if (!item) {
      throw new NotFoundException(`Libellé Production with ID ${id} not found`);
    }

    return this.syncProductionCost(item);
  }

  async update(id: string, updateLibelleProductionDto: UpdateLibelleProductionDto, userId: string) {
    const current = await this.findOne(id, userId);

    if (updateLibelleProductionDto.ouvrageId && updateLibelleProductionDto.ouvrageId !== current.ouvrageId) {
      const newOuvrage = await this.prisma.ouvrage.findFirst({
        where: { id: updateLibelleProductionDto.ouvrageId, serie: { marche: { userId } } },
      });
      if (!newOuvrage) {
        throw new NotFoundException(`New Ouvrage not found or unauthorized`);
      }
    }

    if (updateLibelleProductionDto.code) {
      const ouvrageId = updateLibelleProductionDto.ouvrageId ?? current.ouvrageId;
      const existing = await this.prisma.libelleProduction.findFirst({
        where: { ouvrageId, code: updateLibelleProductionDto.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Code Libellé Production ${updateLibelleProductionDto.code} already exists`);
      }
    }

    const quantite = updateLibelleProductionDto.quantite !== undefined ? updateLibelleProductionDto.quantite : current.quantite;
    const puMarcheHT = updateLibelleProductionDto.puMarcheHT !== undefined ? updateLibelleProductionDto.puMarcheHT : current.puMarcheHT;
    const puRevientReference = updateLibelleProductionDto.puRevientReference !== undefined ? updateLibelleProductionDto.puRevientReference : current.puRevientReference;

    const pptMarcheHT = quantite * puMarcheHT;
    const pptRevientReference = quantite * puRevientReference;
    const pptProduction = quantite * current.puProduction;

    return this.prisma.libelleProduction.update({
      where: { id },
      data: {
        ...updateLibelleProductionDto,
        pptMarcheHT,
        pptRevientReference,
        pptProduction,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.libelleProduction.delete({
      where: { id },
    });
  }

  async recalculateProductionCost(id: string) {
    const item = await this.prisma.libelleProduction.findUnique({
      where: { id },
      include: { decompositions: true },
    });

    if (!item) return;

    // Le PU de production est la somme des montants de la décomposition.
    // Chaque décomposition représente la part de coût (quantité * prix unitaire) pour 1 unité de production.
    const puProduction = item.decompositions.reduce((sum, decomp) => sum + (decomp.montant || 0), 0);
    const pptProduction = item.quantite * puProduction;

    await this.prisma.libelleProduction.update({
      where: { id },
      data: {
        puProduction,
        pptProduction,
      },
    });
  }
}
