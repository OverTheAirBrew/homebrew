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
const sequelize_typescript_1 = require("sequelize-typescript");
const sensor_1 = require("./sensor");
const base_model_1 = require("../base-model");
let Telemetry = class Telemetry extends base_model_1.BaseModel {
};
__decorate([
    sequelize_typescript_1.Default(sequelize_typescript_1.DataType.UUIDV4),
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Telemetry.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.UUID),
    sequelize_typescript_1.ForeignKey(() => sensor_1.default),
    __metadata("design:type", String)
], Telemetry.prototype, "sensor_id", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Telemetry.prototype, "reading", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => sensor_1.default, { foreignKey: 'id' }),
    __metadata("design:type", sensor_1.default)
], Telemetry.prototype, "sensor", void 0);
Telemetry = __decorate([
    sequelize_typescript_1.Table({ modelName: 'telemetry' })
], Telemetry);
exports.default = Telemetry;
//# sourceMappingURL=telemetry.js.map