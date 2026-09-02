import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDecompositionDto, UpdateDecompositionDto } from './decomposition.dto';
import { LibelleProductionService } from '../production/production.service';

@Injectable()
export class DecompositionService {
  constructor(
    private prisma: PrismaService,
    private productionService: LibelleProductionService,
  ) {}

  async create(createDto: CreateDecompositionDto, userId: string) {
    const lp = await this.prisma.libelleProduction.findFirst({
      where: { id: createDto.libelleProductionId, ouvrage: { serie: { marche: { userId } } } },
    });
    if (!lp) {
      throw new NotFoundException(`Libellé Production not found or unauthorized`);
    }

    const existing = await this.prisma.decomposition.findFirst({
      where: {
        libelleProductionId: createDto.libelleProductionId,
        code: createDto.code,
      },
    });
    if (existing) {
      throw new ConflictException(`Code Décomposition ${createDto.code} already exists for this libellé`);
    }

    const montant = createDto.quantite * createDto.prixUnitaire;

    const decomposition = await this.prisma.decomposition.create({
      data: {
        ...createDto,
        montant,
      },
    });

    // Mettre à jour le coût du libellé de production parent
    await this.productionService.recalculateProductionCost(createDto.libelleProductionId);

    return decomposition;
  }

  async findAll(userId: string, libelleProductionId?: string, search?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where: any = { libelleProduction: { ouvrage: { serie: { marche: { userId } } } } };

    if (libelleProductionId) {
      where.libelleProductionId = libelleProductionId;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { libelleElement: { contains: search, mode: 'insensitive' } },
        { section: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.decomposition.findMany({
        where,
        skip,
        take: limit,
        include: {
          libelleProduction: {
            select: { code: true, libelleProduction: true },
          },
        },
        orderBy: { code: 'asc' },
      }),
      this.prisma.decomposition.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const item = await this.prisma.decomposition.findFirst({
      where: { id, libelleProduction: { ouvrage: { serie: { marche: { userId } } } } },
      include: {
        libelleProduction: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Décomposition with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: UpdateDecompositionDto, userId: string) {
    const current = await this.findOne(id, userId);

    if (updateDto.libelleProductionId && updateDto.libelleProductionId !== current.libelleProductionId) {
      const newLp = await this.prisma.libelleProduction.findFirst({
        where: { id: updateDto.libelleProductionId, ouvrage: { serie: { marche: { userId } } } },
      });
      if (!newLp) {
        throw new NotFoundException(`New Libellé Production not found or unauthorized`);
      }
    }

    if (updateDto.code) {
      const lpId = updateDto.libelleProductionId ?? current.libelleProductionId;
      const existing = await this.prisma.decomposition.findFirst({
        where: { libelleProductionId: lpId, code: updateDto.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Code Décomposition ${updateDto.code} already exists`);
      }
    }

    const quantite = updateDto.quantite !== undefined ? updateDto.quantite : current.quantite;
    const prixUnitaire = updateDto.prixUnitaire !== undefined ? updateDto.prixUnitaire : current.prixUnitaire;
    const montant = quantite * prixUnitaire;

    const decomposition = await this.prisma.decomposition.update({
      where: { id },
      data: {
        ...updateDto,
        montant,
      },
    });

    // Mettre à jour le coût du libellé de production parent
    await this.productionService.recalculateProductionCost(decomposition.libelleProductionId);

    // Si on a déplacé l'élément vers un autre libellé
    if (updateDto.libelleProductionId && updateDto.libelleProductionId !== current.libelleProductionId) {
      await this.productionService.recalculateProductionCost(current.libelleProductionId);
    }

    return decomposition;
  }

  async remove(id: string, userId: string) {
    const current = await this.findOne(id, userId);
    const result = await this.prisma.decomposition.delete({
      where: { id },
    });

    // Mettre à jour le coût du libellé de production parent
    await this.productionService.recalculateProductionCost(current.libelleProductionId);

    return result;
  }
}
