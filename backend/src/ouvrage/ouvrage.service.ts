import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOuvrageDto, UpdateOuvrageDto } from './ouvrage.dto';

@Injectable()
export class OuvrageService {
  constructor(private prisma: PrismaService) {}

  async create(createOuvrageDto: CreateOuvrageDto, userId: string) {
    const serie = await this.prisma.serie.findFirst({
      where: { id: createOuvrageDto.serieId, marche: { userId } },
    });
    if (!serie) {
      throw new NotFoundException(`Série not found or unauthorized`);
    }

    const existing = await this.prisma.ouvrage.findFirst({
      where: {
        serieId: createOuvrageDto.serieId,
        code: createOuvrageDto.code,
      },
    });
    if (existing) {
      throw new ConflictException(`Code Ouvrage ${createOuvrageDto.code} already exists for this série`);
    }

    const pptMarcheHT = createOuvrageDto.quantite * createOuvrageDto.puMarcheHT;
    const pptRevientReference = createOuvrageDto.quantite * createOuvrageDto.puRevientReference;

    return this.prisma.ouvrage.create({
      data: {
        ...createOuvrageDto,
        pptMarcheHT,
        pptRevientReference,
      },
    });
  }

  async findAll(userId: string, serieId?: string, search?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where: any = { serie: { marche: { userId } } };

    if (serieId) {
      where.serieId = serieId;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { ouvrage: { contains: search, mode: 'insensitive' } },
        { numeroPrixBordereau: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.ouvrage.findMany({
        where,
        skip,
        take: limit,
        include: {
          serie: {
            select: {
              code: true,
              serie: true,
              marche: { select: { codeAffaire: true, numeroMarche: true } },
            },
          },
        },
        orderBy: { code: 'asc' },
      }),
      this.prisma.ouvrage.count({ where }),
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
    const ouvrage = await this.prisma.ouvrage.findFirst({
      where: { id, serie: { marche: { userId } } },
      include: {
        serie: {
          select: {
            code: true,
            serie: true,
            marche: { select: { codeAffaire: true, numeroMarche: true } },
          },
        },
        libellesProduction: true,
      },
    });
    if (!ouvrage) {
      throw new NotFoundException(`Ouvrage with ID ${id} not found`);
    }
    return ouvrage;
  }

  async update(id: string, updateOuvrageDto: UpdateOuvrageDto, userId: string) {
    const current = await this.findOne(id, userId);

    if (updateOuvrageDto.serieId && updateOuvrageDto.serieId !== current.serieId) {
      const newSerie = await this.prisma.serie.findFirst({
        where: { id: updateOuvrageDto.serieId, marche: { userId } },
      });
      if (!newSerie) {
        throw new NotFoundException(`New Série not found or unauthorized`);
      }
    }

    if (updateOuvrageDto.code) {
      const serieId = updateOuvrageDto.serieId ?? current.serieId;
      const existing = await this.prisma.ouvrage.findFirst({
        where: { serieId, code: updateOuvrageDto.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Code Ouvrage ${updateOuvrageDto.code} already exists`);
      }
    }

    const quantite = updateOuvrageDto.quantite !== undefined ? updateOuvrageDto.quantite : current.quantite;
    const puMarcheHT = updateOuvrageDto.puMarcheHT !== undefined ? updateOuvrageDto.puMarcheHT : current.puMarcheHT;
    const puRevientReference = updateOuvrageDto.puRevientReference !== undefined ? updateOuvrageDto.puRevientReference : current.puRevientReference;

    const pptMarcheHT = quantite * puMarcheHT;
    const pptRevientReference = quantite * puRevientReference;

    return this.prisma.ouvrage.update({
      where: { id },
      data: {
        ...updateOuvrageDto,
        pptMarcheHT,
        pptRevientReference,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.ouvrage.delete({
      where: { id },
    });
  }
}
