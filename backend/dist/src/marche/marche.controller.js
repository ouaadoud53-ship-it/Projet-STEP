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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcheController = void 0;
const common_1 = require("@nestjs/common");
const marche_service_1 = require("./marche.service");
const marche_dto_1 = require("./marche.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MarcheController = class MarcheController {
    constructor(marcheService) {
        this.marcheService = marcheService;
    }
    create(req, createMarcheDto) {
        return this.marcheService.create(createMarcheDto, req.user.id);
    }
    findAll(req, search, etat, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.marcheService.findAll(req.user.id, search, etat, pageNum, limitNum);
    }
    findOne(req, id) {
        return this.marcheService.findOne(id, req.user.id);
    }
    update(req, id, updateMarcheDto) {
        return this.marcheService.update(id, updateMarcheDto, req.user.id);
    }
    remove(req, id) {
        return this.marcheService.remove(id, req.user.id);
    }
};
exports.MarcheController = MarcheController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, marche_dto_1.CreateMarcheDto]),
    __metadata("design:returntype", void 0)
], MarcheController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('etat')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], MarcheController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MarcheController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, marche_dto_1.UpdateMarcheDto]),
    __metadata("design:returntype", void 0)
], MarcheController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MarcheController.prototype, "remove", null);
exports.MarcheController = MarcheController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('marches'),
    __metadata("design:paramtypes", [marche_service_1.MarcheService])
], MarcheController);
//# sourceMappingURL=marche.controller.js.map