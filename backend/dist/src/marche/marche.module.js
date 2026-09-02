"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcheModule = void 0;
const common_1 = require("@nestjs/common");
const marche_service_1 = require("./marche.service");
const marche_controller_1 = require("./marche.controller");
const prisma_service_1 = require("../common/prisma.service");
let MarcheModule = class MarcheModule {
};
exports.MarcheModule = MarcheModule;
exports.MarcheModule = MarcheModule = __decorate([
    (0, common_1.Module)({
        controllers: [marche_controller_1.MarcheController],
        providers: [marche_service_1.MarcheService, prisma_service_1.PrismaService],
        exports: [marche_service_1.MarcheService],
    })
], MarcheModule);
//# sourceMappingURL=marche.module.js.map