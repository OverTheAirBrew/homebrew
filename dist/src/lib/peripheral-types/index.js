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
exports.PeripheralTypeService = void 0;
const homebrew_plugin_1 = require("@overtheairbrew/homebrew-plugin");
const typedi_1 = require("typedi");
const property_mapper_1 = require("../mappers/property-mapper");
const peripheral_type_dto_1 = require("../models/peripheral-type-dto");
let PeripheralTypeService = class PeripheralTypeService {
    constructor(actors, propMapper) {
        this.actors = actors;
        this.propMapper = propMapper;
    }
    getPeripheralTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const peripheralTypes = yield Promise.all(this.actors.map((actor) => __awaiter(this, void 0, void 0, function* () {
                const properties = yield Promise.all(actor.properties.map(this.propMapper.map));
                return new peripheral_type_dto_1.PeripheralTypeDto(actor.actorName, properties);
            })));
            return peripheralTypes;
        });
    }
};
PeripheralTypeService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.InjectMany(homebrew_plugin_1.ActorToken)),
    __metadata("design:paramtypes", [Array, property_mapper_1.PropertyTypeMapper])
], PeripheralTypeService);
exports.PeripheralTypeService = PeripheralTypeService;
//# sourceMappingURL=index.js.map