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
exports.SensorService = void 0;
const typedi_1 = require("typedi");
const repository_1 = require("./repository");
const validation_1 = require("./validation");
const validation_error_1 = require("../errors/validation-error");
const homebrew_plugin_1 = require("@overtheairbrew/homebrew-plugin");
const fluent_ts_validator_1 = require("fluent-ts-validator");
const sensor_implementation_not_found_1 = require("../errors/sensor-implementation-not-found");
const repoository_1 = require("../telemetry/repoository");
const logger_1 = require("../logger");
let SensorService = class SensorService {
    constructor(sensorRepository, telemetryRepository, validator, sensors, logger) {
        this.sensorRepository = sensorRepository;
        this.telemetryRepository = telemetryRepository;
        this.validator = validator;
        this.sensors = sensors;
        this.logger = logger;
    }
    getSensorImplementation(type_id, shouldThrow = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const implementation = this.sensors.find((si) => si.sensorType === type_id);
            if (!implementation) {
                if (shouldThrow) {
                    throw new sensor_implementation_not_found_1.SensorImplementationNotFoundError(type_id);
                }
                this.logger.error(new sensor_implementation_not_found_1.SensorImplementationNotFoundError(type_id));
                return null;
            }
            return implementation;
        });
    }
    sendDataForConfiguredSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            const sensors = yield this.sensorRepository.getSensors();
            for (const sensor of sensors) {
                const sensorImplementation = yield this.getSensorImplementation(sensor.type_id, false);
                if (!sensorImplementation) {
                    continue;
                }
                const value = yield sensorImplementation.run(Object.assign({ sensor_id: sensor.id }, sensor.config));
                if (!value)
                    return;
                yield this.telemetryRepository.addTelemetryRecord(sensor.id, value);
            }
        });
    }
    createSensor(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            const sensorImplementation = yield this.getSensorImplementation(sensor.type_id);
            const validationResult = yield this.validator.validateAsync(sensor);
            const configValid = yield sensorImplementation.validate(sensor.config);
            if (validationResult.isValid() && configValid) {
                const id = yield this.sensorRepository.createSensor(sensor.name, sensor.type_id, { sensorAddress: sensor.config.busAddress });
                return id;
            }
            const newValidationResult = new fluent_ts_validator_1.ValidationResult();
            newValidationResult.addFailures(validationResult.getFailures());
            if (!configValid) {
                newValidationResult.addFailures([
                    new fluent_ts_validator_1.ValidationFailure('', 'config', sensor.config, 'SENSOR_CONFIG_INVALID'),
                ]);
            }
            throw new validation_error_1.ValidationError(newValidationResult);
        });
    }
};
SensorService = __decorate([
    typedi_1.Service(),
    __param(3, typedi_1.InjectMany(homebrew_plugin_1.SensorToken)),
    __metadata("design:paramtypes", [repository_1.SensorRepository,
        repoository_1.TelemetryRepository,
        validation_1.SensorValidator, Array, logger_1.Logger])
], SensorService);
exports.SensorService = SensorService;
//# sourceMappingURL=index.js.map