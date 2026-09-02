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
exports.OuvrageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let OuvrageService = class OuvrageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOuvrageDto, userId) {
        const serie = await this.prisma.serie.findFirst({
            where: { id: createOuvrageDto.serieId, marche: { userId } },
        });
        if (!serie) {
            throw new common_1.NotFoundException(`Série not found or unauthorized`);
        }
        const existing = await this.prisma.ouvrage.findFirst({
            where: {
                serieId: createOuvrageDto.serieId,
                code: createOuvrageDto.code,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Code Ouvrage ${createOuvrageDto.code} already exists for this série`);
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
    async findAll(userId, serieId, search, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = { serie: { marche: { userId } } };
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException(`Ouvrage with ID ${id} not found`);
        }
        return ouvrage;
    }
    async update(id, updateOuvrageDto, userId) {
        const current = await this.findOne(id, userId);
        if (updateOuvrageDto.serieId && updateOuvrageDto.serieId !== current.serieId) {
            const newSerie = await this.prisma.serie.findFirst({
                where: { id: updateOuvrageDto.serieId, marche: { userId } },
            });
            if (!newSerie) {
                throw new common_1.NotFoundException(`New Série not found or unauthorized`);
            }
        }
        if (updateOuvrageDto.code) {
            const serieId = updateOuvrageDto.serieId ?? current.serieId;
            const existing = await this.prisma.ouvrage.findFirst({
                where: { serieId, code: updateOuvrageDto.code },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Code Ouvrage ${updateOuvrageDto.code} already exists`);
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
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.ouvrage.delete({
            where: { id },
        });
    }
};
exports.OuvrageService = OuvrageService;
exports.OuvrageService = OuvrageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OuvrageService);
//# sourceMappingURL=ouvrage.service.js.map