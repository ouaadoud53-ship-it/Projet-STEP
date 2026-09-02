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
exports.SerieService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let SerieService = class SerieService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSerieDto, userId) {
        const marche = await this.prisma.marche.findFirst({
            where: { id: createSerieDto.marcheId, userId },
        });
        if (!marche) {
            throw new common_1.NotFoundException(`Marché not found or unauthorized`);
        }
        const existing = await this.prisma.serie.findFirst({
            where: {
                marcheId: createSerieDto.marcheId,
                code: createSerieDto.code,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Code Série ${createSerieDto.code} already exists for this marché`);
        }
        const pptMarcheHT = createSerieDto.quantite * createSerieDto.puMarcheHT;
        return this.prisma.serie.create({
            data: {
                ...createSerieDto,
                pptMarcheHT,
            },
        });
    }
    async findAll(userId, marcheId, search, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = { marche: { userId } };
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
    async findOne(id, userId) {
        const serie = await this.prisma.serie.findFirst({
            where: { id, marche: { userId } },
            include: {
                marche: true,
                ouvrages: true,
            },
        });
        if (!serie) {
            throw new common_1.NotFoundException(`Série with ID ${id} not found`);
        }
        return serie;
    }
    async update(id, updateSerieDto, userId) {
        const current = await this.findOne(id, userId);
        if (updateSerieDto.marcheId && updateSerieDto.marcheId !== current.marcheId) {
            const newMarche = await this.prisma.marche.findFirst({
                where: { id: updateSerieDto.marcheId, userId },
            });
            if (!newMarche) {
                throw new common_1.NotFoundException(`New Marché not found or unauthorized`);
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
                throw new common_1.ConflictException(`Code Série ${updateSerieDto.code} already exists for this marché`);
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
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.serie.delete({
            where: { id },
        });
    }
};
exports.SerieService = SerieService;
exports.SerieService = SerieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SerieService);
//# sourceMappingURL=serie.service.js.map