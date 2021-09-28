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
exports.SensorValidator = void 0;
const fluent_ts_validator_1 = require("fluent-ts-validator");
const typedi_1 = require("typedi");
let SensorValidator = class SensorValidator extends fluent_ts_validator_1.AbstractValidator {
    constructor(sensorTypes) {
        super();
        this.validateIfString((x) => x.name)
            .isDefined()
            .withFailureCode('NAME_INVALID');
        this.validateIfString((x) => x.type_id)
            .isIn(sensorTypes)
            .withFailureCode('SENSOR_TYPE_INVALID');
    }
};
SensorValidator = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('sensorTypes')),
    __metadata("design:paramtypes", [Array])
], SensorValidator);
exports.SensorValidator = SensorValidator;
//# sourceMappingURL=validation.js.map