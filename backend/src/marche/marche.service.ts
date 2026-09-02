import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateMarcheDto, UpdateMarcheDto, EtatMarche } from './marche.dto';

@Injectable()
export class MarcheService {
  constructor(private prisma: PrismaService) {}

  async create(createMarcheDto: CreateMarcheDto, userId: string) {
    const existing = await this.prisma.marche.findUnique({
      where: { userId_codeAffaire: { userId, codeAffaire: createMarcheDto.codeAffaire } },
    });
    if (existing) {
      throw new ConflictException(`Code Affaire ${createMarcheDto.codeAffaire} already exists`);
    }

    return this.prisma.marche.create({
      data: {
        ...createMarcheDto,
        dateOSCommencement: new Date(createMarcheDto.dateOSCommencement),
        userId,
      },
    });
  }

  async findAll(userId: string, search?: string, etat?: EtatMarche, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (etat) {
      where.etat = etat;
    }

    if (search) {
      where.OR = [
        { codeAffaire: { contains: search, mode: 'insensitive' } },
        { numeroMarche: { contains: search, mode: 'insensitive' } },
        { maitreOuvrage: { contains: search, mode: 'insensitive' } },
        { partenaire: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.marche.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.marche.count({ where }),
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
    const marche = await this.prisma.marche.findFirst({
      where: { id, userId },
      include: {
        series: {
          orderBy: { code: 'asc' },
        },
      },
    });
    if (!marche) {
      throw new NotFoundException(`Marche with ID ${id} not found`);
    }
    return marche;
  }

  async update(id: string, updateMarcheDto: UpdateMarcheDto, userId: string) {
    await this.findOne(id, userId);

    if (updateMarcheDto.codeAffaire) {
      const existing = await this.prisma.marche.findUnique({
        where: { userId_codeAffaire: { userId, codeAffaire: updateMarcheDto.codeAffaire } },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Code Affaire ${updateMarcheDto.codeAffaire} already exists`);
      }
    }

    const data: any = { ...updateMarcheDto };
    if (updateMarcheDto.dateOSCommencement) {
      data.dateOSCommencement = new Date(updateMarcheDto.dateOSCommencement);
    }

    return this.prisma.marche.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.marche.delete({
      where: { id },
    });
  }
}
