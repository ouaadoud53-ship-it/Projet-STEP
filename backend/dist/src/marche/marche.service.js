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
exports.MarcheService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let MarcheService = class MarcheService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMarcheDto, userId) {
        const existing = await this.prisma.marche.findUnique({
            where: { userId_codeAffaire: { userId, codeAffaire: createMarcheDto.codeAffaire } },
        });
        if (existing) {
            throw new common_1.ConflictException(`Code Affaire ${createMarcheDto.codeAffaire} already exists`);
        }
        return this.prisma.marche.create({
            data: {
                ...createMarcheDto,
                dateOSCommencement: new Date(createMarcheDto.dateOSCommencement),
                userId,
            },
        });
    }
    async findAll(userId, search, etat, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { userId };
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
    async findOne(id, userId) {
        const marche = await this.prisma.marche.findFirst({
            where: { id, userId },
            include: {
                series: {
                    orderBy: { code: 'asc' },
                },
            },
        });
        if (!marche) {
            throw new common_1.NotFoundException(`Marche with ID ${id} not found`);
        }
        return marche;
    }
    async update(id, updateMarcheDto, userId) {
        await this.findOne(id, userId);
        if (updateMarcheDto.codeAffaire) {
            const existing = await this.prisma.marche.findUnique({
                where: { userId_codeAffaire: { userId, codeAffaire: updateMarcheDto.codeAffaire } },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Code Affaire ${updateMarcheDto.codeAffaire} already exists`);
            }
        }
        const data = { ...updateMarcheDto };
        if (updateMarcheDto.dateOSCommencement) {
            data.dateOSCommencement = new Date(updateMarcheDto.dateOSCommencement);
        }
        return this.prisma.marche.update({
            where: { id },
            data,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.marche.delete({
            where: { id },
        });
    }
};
exports.MarcheService = MarcheService;
exports.MarcheService = MarcheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarcheService);
//# sourceMappingURL=marche.service.js.map