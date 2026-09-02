import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateSerieDto, UpdateSerieDto } from './serie.dto';

@Injectable()
export class SerieService {
  constructor(private prisma: PrismaService) {}

  async create(createSerieDto: CreateSerieDto, userId: string) {
    const marche = await this.prisma.marche.findFirst({
      where: { id: createSerieDto.marcheId, userId },
    });
    if (!marche) {
      throw new NotFoundException(`Marché not found or unauthorized`);
    }

    const existing = await this.prisma.serie.findFirst({
      where: {
        marcheId: createSerieDto.marcheId,
        code: createSerieDto.code,
      },
    });
    if (existing) {
      throw new ConflictException(`Code Série ${createSerieDto.code} already exists for this marché`);
    }

    const pptMarcheHT = createSerieDto.quantite * createSerieDto.puMarcheHT;

    return this.prisma.serie.create({
      data: {
        ...createSerieDto,
        pptMarcheHT,
      },
    });
  }

  async findAll(userId: string, marcheId?: string, search?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where: any = { marche: { userId } };

    if (marcheId) {
      where.marcheId = marcheId;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { serie: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.serie.findMany({
        where,
        skip,
        take: limit,
        include: {
          marche: {
            select: { codeAffaire: true, numeroMarche: true },
          },
        },
        orderBy: { code: 'asc' },
      }),
      this.prisma.serie.count({ where }),
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
    const serie = await this.prisma.serie.findFirst({
      where: { id, marche: { userId } },
      include: {
        marche: true,
        ouvrages: true,
      },
    });
    if (!serie) {
      throw new NotFoundException(`Série with ID ${id} not found`);
    }
    return serie;
  }

  async update(id: string, updateSerieDto: UpdateSerieDto, userId: string) {
    const current = await this.findOne(id, userId);

    if (updateSerieDto.marcheId && updateSerieDto.marcheId !== current.marcheId) {
      const newMarche = await this.prisma.marche.findFirst({
        where: { id: updateSerieDto.marcheId, userId },
      });
      if (!newMarche) {
        throw new NotFoundException(`New Marché not found or unauthorized`);
      }
    }

    if (updateSerieDto.code) {
      const marcheId = updateSerieDto.marcheId ?? current.marcheId;
      const existing = await this.prisma.serie.findFirst({
        where: {
          marcheId,
          code: updateSerieDto.code,
        },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Code Série ${updateSerieDto.code} already exists for this marché`);
      }
    }

    const quantite = updateSerieDto.quantite !== undefined ? updateSerieDto.quantite : current.quantite;
    const puMarcheHT = updateSerieDto.puMarcheHT !== undefined ? updateSerieDto.puMarcheHT : current.puMarcheHT;
    const pptMarcheHT = quantite * puMarcheHT;

    return this.prisma.serie.update({
      where: { id },
      data: {
        ...updateSerieDto,
        pptMarcheHT,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.serie.delete({
      where: { id },
    });
  }
}
