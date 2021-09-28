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
exports.Peripheral = exports.PeripheralDto = void 0;
const class_validator_1 = require("class-validator");
class PeripheralDto {
    constructor(id, name, type_id, config) {
        this.id = id;
        this.name = name;
        this.type_id = type_id;
        this.config = config;
    }
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PeripheralDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PeripheralDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PeripheralDto.prototype, "type_id", void 0);
__decorate([
    class_validator_1.IsObject(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], PeripheralDto.prototype, "config", void 0);
exports.PeripheralDto = PeripheralDto;
class Peripheral {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Peripheral.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Peripheral.prototype, "type_id", void 0);
__decorate([
    class_validator_1.IsObject(),
    class_validator_1.IsNotEmptyObject(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], Peripheral.prototype, "config", void 0);
exports.Peripheral = Peripheral;
//# sourceMappingURL=peripheral.js.map