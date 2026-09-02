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
exports.UpdateMarcheDto = exports.CreateMarcheDto = exports.EtatMarche = void 0;
const class_validator_1 = require("class-validator");
var EtatMarche;
(function (EtatMarche) {
    EtatMarche["PREPARATION"] = "PREPARATION";
    EtatMarche["EN_COURS"] = "EN_COURS";
    EtatMarche["TERMINE"] = "TERMINE";
    EtatMarche["CLOTURE"] = "CLOTURE";
})(EtatMarche || (exports.EtatMarche = EtatMarche = {}));
class CreateMarcheDto {
}
exports.CreateMarcheDto = CreateMarcheDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMarcheDto.prototype, "codeAffaire", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMarcheDto.prototype, "numeroMarche", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMarcheDto.prototype, "maitreOuvrage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMarcheDto.prototype, "partenaire", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMarcheDto.prototype, "dateOSCommencement", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMarcheDto.prototype, "delaiProjetMois", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EtatMarche),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarcheDto.prototype, "etat", void 0);
class UpdateMarcheDto {
}
exports.UpdateMarcheDto = UpdateMarcheDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcheDto.prototype, "codeAffaire", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcheDto.prototype, "numeroMarche", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcheDto.prototype, "maitreOuvrage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcheDto.prototype, "partenaire", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcheDto.prototype, "dateOSCommencement", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMarcheDto.prototype, "delaiProjetMois", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EtatMarche),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcheDto.prototype, "etat", void 0);
//# sourceMappingURL=marche.dto.js.map