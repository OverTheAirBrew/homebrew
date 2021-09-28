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
exports.SensorDto = exports.Sensor = exports.OneWireConfig = exports.SensorType = void 0;
const class_validator_1 = require("class-validator");
var SensorType;
(function (SensorType) {
    SensorType["onewire"] = "one-wire";
})(SensorType = exports.SensorType || (exports.SensorType = {}));
class OneWireConfig {
}
exports.OneWireConfig = OneWireConfig;
class Sensor {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Sensor.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Sensor.prototype, "type_id", void 0);
__decorate([
    class_validator_1.IsObject(),
    class_validator_1.IsNotEmptyObject(),
    __metadata("design:type", Object)
], Sensor.prototype, "config", void 0);
exports.Sensor = Sensor;
class SensorDto {
    constructor(id, name, type_id) {
        this.id = id;
        this.name = name;
        this.type_id = type_id;
    }
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SensorDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SensorDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SensorDto.prototype, "type_id", void 0);
exports.SensorDto = SensorDto;
//# sourceMappingURL=sensor.js.map