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
exports.DecompositionController = void 0;
const common_1 = require("@nestjs/common");
const decomposition_service_1 = require("./decomposition.service");
const decomposition_dto_1 = require("./decomposition.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DecompositionController = class DecompositionController {
    constructor(decompositionService) {
        this.decompositionService = decompositionService;
    }
    create(req, createDto) {
        return this.decompositionService.create(createDto, req.user.id);
    }
    findAll(req, libelleProductionId, search, page, limit) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 50;
        return this.decompositionService.findAll(req.user.id, libelleProductionId, search, pageNum, limitNum);
    }
    findOne(req, id) {
        return this.decompositionService.findOne(id, req.user.id);
    }
    update(req, id, updateDto) {
        return this.decompositionService.update(id, updateDto, req.user.id);
    }
    remove(req, id) {
        return this.decompositionService.remove(id, req.user.id);
    }
};
exports.DecompositionController = DecompositionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decomposition_dto_1.CreateDecompositionDto]),
    __metadata("design:returntype", void 0)
], DecompositionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('libelleProductionId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DecompositionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DecompositionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, decomposition_dto_1.UpdateDecompositionDto]),
    __metadata("design:returntype", void 0)
], DecompositionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DecompositionController.prototype, "remove", null);
exports.DecompositionController = DecompositionController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('decompositions'),
    __metadata("design:paramtypes", [decomposition_service_1.DecompositionService])
], DecompositionController);
//# sourceMappingURL=decomposition.controller.js.map