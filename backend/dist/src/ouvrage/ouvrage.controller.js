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
exports.OuvrageController = void 0;
const common_1 = require("@nestjs/common");
const ouvrage_service_1 = require("./ouvrage.service");
const ouvrage_dto_1 = require("./ouvrage.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let OuvrageController = class OuvrageController {
    constructor(ouvrageService) {
        this.ouvrageService = ouvrageService;
    }
    create(req, createOuvrageDto) {
        return this.ouvrageService.create(createOuvrageDto, req.user.id);
    }
    findAll(req, serieId, search, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 50;
        return this.ouvrageService.findAll(req.user.id, serieId, search, pageNum, limitNum);
    }
    findOne(req, id) {
        return this.ouvrageService.findOne(id, req.user.id);
    }
    update(req, id, updateOuvrageDto) {
        return this.ouvrageService.update(id, updateOuvrageDto, req.user.id);
    }
    remove(req, id) {
        return this.ouvrageService.remove(id, req.user.id);
    }
};
exports.OuvrageController = OuvrageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ouvrage_dto_1.CreateOuvrageDto]),
    __metadata("design:returntype", void 0)
], OuvrageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('serieId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], OuvrageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OuvrageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ouvrage_dto_1.UpdateOuvrageDto]),
    __metadata("design:returntype", void 0)
], OuvrageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OuvrageController.prototype, "remove", null);
exports.OuvrageController = OuvrageController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ouvrages'),
    __metadata("design:paramtypes", [ouvrage_service_1.OuvrageService])
], OuvrageController);
//# sourceMappingURL=ouvrage.controller.js.map