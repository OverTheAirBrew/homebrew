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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorTypesController = void 0;
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typedi_1 = require("typedi");
const sensor_type_dto_1 = require("../lib/models/sensor-type-dto");
const sensor_types_1 = require("../lib/sensor-types");
let SensorTypesController = class SensorTypesController {
    constructor(service) {
        this.service = service;
    }
    getSensorTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const sensorTypes = yield this.service.getSensorTypes();
            return sensorTypes;
        });
    }
};
__decorate([
    routing_controllers_1.Get('/sensor-types'),
    routing_controllers_1.HttpCode(200),
    routing_controllers_openapi_1.ResponseSchema(sensor_type_dto_1.SensorTypeDto, { isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SensorTypesController.prototype, "getSensorTypes", null);
SensorTypesController = __decorate([
    routing_controllers_1.JsonController(),
    typedi_1.Service(),
    __metadata("design:paramtypes", [sensor_types_1.SensorTypeService])
], SensorTypesController);
exports.SensorTypesController = SensorTypesController;
//# sourceMappingURL=sensor-types.js.map