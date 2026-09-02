"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OuvrageModule = void 0;
const common_1 = require("@nestjs/common");
const ouvrage_service_1 = require("./ouvrage.service");
const ouvrage_controller_1 = require("./ouvrage.controller");
const prisma_service_1 = require("../common/prisma.service");
let OuvrageModule = class OuvrageModule {
};
exports.OuvrageModule = OuvrageModule;
exports.OuvrageModule = OuvrageModule = __decorate([
    (0, common_1.Module)({
        controllers: [ouvrage_controller_1.OuvrageController],
        providers: [ouvrage_service_1.OuvrageService, prisma_service_1.PrismaService],
        exports: [ouvrage_service_1.OuvrageService],
    })
], OuvrageModule);
//# sourceMappingURL=ouvrage.module.js.map