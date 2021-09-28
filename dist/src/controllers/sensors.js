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
exports.SensorController = void 0;
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typedi_1 = require("typedi");
const id_response_1 = require("../lib/models/id-response");
const sensor_1 = require("../lib/models/sensor");
const sensors_1 = require("../lib/sensors");
let SensorController = class SensorController {
    constructor(service) {
        this.service = service;
    }
    createSensor(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.service.createSensor(body);
            return {
                id,
            };
        });
    }
};
__decorate([
    routing_controllers_1.Post('/sensors'),
    routing_controllers_1.HttpCode(201),
    routing_controllers_openapi_1.ResponseSchema(id_response_1.IdResponse),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensor_1.Sensor]),
    __metadata("design:returntype", Promise)
], SensorController.prototype, "createSensor", null);
SensorController = __decorate([
    routing_controllers_1.JsonController(),
    typedi_1.Service(),
    __metadata("design:paramtypes", [sensors_1.SensorService])
], SensorController);
exports.SensorController = SensorController;
//# sourceMappingURL=sensors.js.map