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
exports.DecompositionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const production_service_1 = require("../production/production.service");
let DecompositionService = class DecompositionService {
    constructor(prisma, productionService) {
        this.prisma = prisma;
        this.productionService = productionService;
    }
    async create(createDto, userId) {
        const lp = await this.prisma.libelleProduction.findFirst({
            where: { id: createDto.libelleProductionId, ouvrage: { serie: { marche: { userId } } } },
        });
        if (!lp) {
            throw new common_1.NotFoundException(`Libellé Production not found or unauthorized`);
        }
        const existing = await this.prisma.decomposition.findFirst({
            where: {
                libelleProductionId: createDto.libelleProductionId,
                code: createDto.code,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Code Décomposition ${createDto.code} already exists for this libellé`);
        }
        const montant = createDto.quantite * createDto.prixUnitaire;
        const decomposition = await this.prisma.decomposition.create({
            data: {
                ...createDto,
                montant,
            },
        });
        await this.productionService.recalculateProductionCost(createDto.libelleProductionId);
        return decomposition;
    }
    async findAll(userId, libelleProductionId, search, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = { libelleProduction: { ouvrage: { serie: { marche: { userId } } } } };
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
    async findOne(id, userId) {
        const item = await this.prisma.decomposition.findFirst({
            where: { id, libelleProduction: { ouvrage: { serie: { marche: { userId } } } } },
            include: {
                libelleProduction: true,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Décomposition with ID ${id} not found`);
        }
        return item;
    }
    async update(id, updateDto, userId) {
        const current = await this.findOne(id, userId);
        if (updateDto.libelleProductionId && updateDto.libelleProductionId !== current.libelleProductionId) {
            const newLp = await this.prisma.libelleProduction.findFirst({
                where: { id: updateDto.libelleProductionId, ouvrage: { serie: { marche: { userId } } } },
            });
            if (!newLp) {
                throw new common_1.NotFoundException(`New Libellé Production not found or unauthorized`);
            }
        }
        if (updateDto.code) {
            const lpId = updateDto.libelleProductionId ?? current.libelleProductionId;
            const existing = await this.prisma.decomposition.findFirst({
                where: { libelleProductionId: lpId, code: updateDto.code },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Code Décomposition ${updateDto.code} already exists`);
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
        await this.productionService.recalculateProductionCost(decomposition.libelleProductionId);
        if (updateDto.libelleProductionId && updateDto.libelleProductionId !== current.libelleProductionId) {
            await this.productionService.recalculateProductionCost(current.libelleProductionId);
        }
        return decomposition;
    }
    async remove(id, userId) {
        const current = await this.findOne(id, userId);
        const result = await this.prisma.decomposition.delete({
            where: { id },
        });
        await this.productionService.recalculateProductionCost(current.libelleProductionId);
        return result;
    }
};
exports.DecompositionService = DecompositionService;
exports.DecompositionService = DecompositionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        production_service_1.LibelleProductionService])
], DecompositionService);
//# sourceMappingURL=decomposition.service.js.map