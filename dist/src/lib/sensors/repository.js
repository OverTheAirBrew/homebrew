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
exports.SensorRepository = void 0;
const typedi_1 = require("typedi");
const sensor_1 = require("../../orm/models/sensor");
const sequelize_wrapper_1 = require("../../orm/sequelize-wrapper");
const base_repository_1 = require("../base-repository");
let SensorRepository = class SensorRepository extends base_repository_1.BaseRepository {
    constructor(wrapper) {
        super(sensor_1.default, wrapper.sequelize);
    }
    getSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            const sensors = yield this.model.findAll({
                where: {},
            });
            return sensors.map((sensor) => sensor.toJSON());
        });
    }
    createSensor(name, type_id, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const sensor = yield this.model.create({
                name,
                type_id,
                config,
            });
            return sensor.id;
        });
    }
};
SensorRepository = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [sequelize_wrapper_1.SequelizeWrapper])
], SensorRepository);
exports.SensorRepository = SensorRepository;
//# sourceMappingURL=repository.js.map