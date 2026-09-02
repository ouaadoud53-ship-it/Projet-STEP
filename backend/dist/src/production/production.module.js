"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibelleProductionModule = void 0;
const common_1 = require("@nestjs/common");
const production_service_1 = require("./production.service");
const production_controller_1 = require("./production.controller");
const prisma_service_1 = require("../common/prisma.service");
let LibelleProductionModule = class LibelleProductionModule {
};
exports.LibelleProductionModule = LibelleProductionModule;
exports.LibelleProductionModule = LibelleProductionModule = __decorate([
    (0, common_1.Module)({
        controllers: [production_controller_1.LibelleProductionController],
        providers: [production_service_1.LibelleProductionService, prisma_service_1.PrismaService],
        exports: [production_service_1.LibelleProductionService],
    })
], LibelleProductionModule);
//# sourceMappingURL=production.module.js.map