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
exports.TelemetryRepository = void 0;
const typedi_1 = require("typedi");
const telemetry_1 = require("../../orm/models/telemetry");
const sequelize_wrapper_1 = require("../../orm/sequelize-wrapper");
const base_repository_1 = require("../base-repository");
let TelemetryRepository = class TelemetryRepository extends base_repository_1.BaseRepository {
    constructor(wrapper) {
        super(telemetry_1.default, wrapper.sequelize);
    }
    addTelemetryRecord(sensor_id, reading) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.create({
                sensor_id,
                reading,
            });
        });
    }
};
TelemetryRepository = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [sequelize_wrapper_1.SequelizeWrapper])
], TelemetryRepository);
exports.TelemetryRepository = TelemetryRepository;
//# sourceMappingURL=repoository.js.map