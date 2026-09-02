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
exports.CreateBulkLibelleProductionDto = exports.UpdateLibelleProductionDto = exports.CreateLibelleProductionDto = void 0;
const class_validator_1 = require("class-validator");
const repartitionValues = ['GC', 'ETU', 'ELE', 'EQ', 'MES', 'EXP', 'EC', 'PM'];
class CreateLibelleProductionDto {
}
exports.CreateLibelleProductionDto = CreateLibelleProductionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLibelleProductionDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLibelleProductionDto.prototype, "numeroPrixUnitaire", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLibelleProductionDto.prototype, "cleRepartition", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLibelleProductionDto.prototype, "libelleProduction", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLibelleProductionDto.prototype, "unite", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateLibelleProductionDto.prototype, "quantite", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateLibelleProductionDto.prototype, "puMarcheHT", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateLibelleProductionDto.prototype, "puRevientReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLibelleProductionDto.prototype, "ouvrageId", void 0);
class UpdateLibelleProductionDto {
}
exports.UpdateLibelleProductionDto = UpdateLibelleProductionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLibelleProductionDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLibelleProductionDto.prototype, "numeroPrixUnitaire", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLibelleProductionDto.prototype, "cleRepartition", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLibelleProductionDto.prototype, "libelleProduction", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLibelleProductionDto.prototype, "unite", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateLibelleProductionDto.prototype, "quantite", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateLibelleProductionDto.prototype, "puMarcheHT", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateLibelleProductionDto.prototype, "puRevientReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLibelleProductionDto.prototype, "ouvrageId", void 0);
const class_transformer_1 = require("class-transformer");
const class_validator_2 = require("class-validator");
class CreateBulkLibelleProductionDto {
}
exports.CreateBulkLibelleProductionDto = CreateBulkLibelleProductionDto;
__decorate([
    (0, class_validator_2.IsArray)(),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateLibelleProductionDto),
    __metadata("design:type", Array)
], CreateBulkLibelleProductionDto.prototype, "items", void 0);
//# sourceMappingURL=production.dto.js.map