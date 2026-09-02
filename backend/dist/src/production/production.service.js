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
exports.LibelleProductionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let LibelleProductionService = class LibelleProductionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncProductionCost(item) {
        const decompositions = item.decompositions || [];
        const puProduction = decompositions.reduce((sum, decomp) => sum + (decomp.montant || 0), 0);
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
    async createBulk(createBulkDto, userId) {
        let imported = 0;
        const errors = [];
        for (const item of createBulkDto.items) {
            try {
                await this.create(item, userId);
                imported++;
            }
            catch (error) {
                errors.push(`Erreur sur le code ${item.code}: ${error.message}`);
            }
        }
        return {
            message: `${imported} libellés importés avec succès.`,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    async create(createLibelleProductionDto, userId) {
        const ouvrage = await this.prisma.ouvrage.findFirst({
            where: { id: createLibelleProductionDto.ouvrageId, serie: { marche: { userId } } },
        });
        if (!ouvrage) {
            throw new common_1.NotFoundException(`Ouvrage not found or unauthorized`);
        }
        const existing = await this.prisma.libelleProduction.findFirst({
            where: {
                ouvrageId: createLibelleProductionDto.ouvrageId,
                code: createLibelleProductionDto.code,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Code Libellé Production ${createLibelleProductionDto.code} already exists for this ouvrage`);
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
    async findAll(userId, ouvrageId, search, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = { ouvrage: { serie: { marche: { userId } } } };
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException(`Libellé Production with ID ${id} not found`);
        }
        return this.syncProductionCost(item);
    }
    async update(id, updateLibelleProductionDto, userId) {
        const current = await this.findOne(id, userId);
        if (updateLibelleProductionDto.ouvrageId && updateLibelleProductionDto.ouvrageId !== current.ouvrageId) {
            const newOuvrage = await this.prisma.ouvrage.findFirst({
                where: { id: updateLibelleProductionDto.ouvrageId, serie: { marche: { userId } } },
            });
            if (!newOuvrage) {
                throw new common_1.NotFoundException(`New Ouvrage not found or unauthorized`);
            }
        }
        if (updateLibelleProductionDto.code) {
            const ouvrageId = updateLibelleProductionDto.ouvrageId ?? current.ouvrageId;
            const existing = await this.prisma.libelleProduction.findFirst({
                where: { ouvrageId, code: updateLibelleProductionDto.code },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Code Libellé Production ${updateLibelleProductionDto.code} already exists`);
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
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.libelleProduction.delete({
            where: { id },
        });
    }
    async recalculateProductionCost(id) {
        const item = await this.prisma.libelleProduction.findUnique({
            where: { id },
            include: { decompositions: true },
        });
        if (!item)
            return;
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
};
exports.LibelleProductionService = LibelleProductionService;
exports.LibelleProductionService = LibelleProductionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LibelleProductionService);
//# sourceMappingURL=production.service.js.map