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
exports.PeripheralService = void 0;
const homebrew_plugin_1 = require("@overtheairbrew/homebrew-plugin");
const typedi_1 = require("typedi");
const create_validation_error_with_config_error_1 = require("../errors/create-validation-error-with-config-error");
const peripheral_not_found_1 = require("../errors/peripheral-not-found");
const logger_1 = require("../logger");
const repository_1 = require("./repository");
const validation_1 = require("./validation");
let PeripheralService = class PeripheralService {
    constructor(actors, logger, validator, repository) {
        this.actors = actors;
        this.logger = logger;
        this.validator = validator;
        this.repository = repository;
    }
    getPeripheralImplementation(type_id, shouldThrow = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const implementation = this.actors.find((a) => a.actorName === type_id);
            if (!implementation) {
                if (shouldThrow) {
                    throw new peripheral_not_found_1.PeripheralNotFoundError(type_id);
                }
                this.logger.error(new peripheral_not_found_1.PeripheralNotFoundError(type_id));
                return null;
            }
            return implementation;
        });
    }
    createPeripheral(peripheral) {
        return __awaiter(this, void 0, void 0, function* () {
            const peripheralImplementation = yield this.getPeripheralImplementation(peripheral.type_id);
            const validationResult = yield this.validator.validateAsync(peripheral);
            const configValid = yield peripheralImplementation.validate(peripheral.config);
            if (validationResult.isValid() && configValid) {
                const id = yield this.repository.createPeripheral(peripheral.name, peripheral.type_id, peripheral.config);
                return id;
            }
            const error = yield create_validation_error_with_config_error_1.createValidationErrorWithConfigError(validationResult.getFailures(), configValid, peripheral.config);
            throw error;
        });
    }
    getPeripherals() {
        return __awaiter(this, void 0, void 0, function* () {
            const peripherals = yield this.repository.getPeripherals();
            return yield Promise.all(peripherals.map(this.mapPeripheral));
        });
    }
    getPeripheralById(peripheral_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const peripheral = yield this.repository.getPeripheral(peripheral_id);
            return yield this.mapPeripheral(peripheral);
        });
    }
    mapPeripheral(peripheral) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: peripheral.id,
                name: peripheral.name,
                type_id: peripheral.type_id,
                config: peripheral.config,
            };
        });
    }
};
PeripheralService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.InjectMany(homebrew_plugin_1.ActorToken)),
    __metadata("design:paramtypes", [Array, logger_1.Logger,
        validation_1.PeripheralsValidator,
        repository_1.PeripheralsRepository])
], PeripheralService);
exports.PeripheralService = PeripheralService;
//# sourceMappingURL=index.js.map