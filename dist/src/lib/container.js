"use strict";
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
exports.OtaContainer = void 0;
const homebrew_plugin_1 = require("@overtheairbrew/homebrew-plugin");
const node_typedi_in_memory_queue_1 = require("@overtheairbrew/node-typedi-in-memory-queue");
const typedi_1 = require("typedi");
const logger_1 = require("./logger");
const messaging_manager_1 = require("./messaging-manager");
const sensor_types_1 = require("./sensor-types");
class OtaContainer {
    constructor() { }
    static setupContainer(httpServer, database, queues, pluginConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            typedi_1.default.set('socket.io_cors_origin', `*`);
            typedi_1.default.set('databaseOptions', database);
            typedi_1.default.set('loggingOptions', {
                level: 'error',
                serviceName: 'homebrew',
                node_env: process.env.NODE_ENV || 'development',
            });
            typedi_1.default.set('http_instance', httpServer);
            typedi_1.default.set(node_typedi_in_memory_queue_1.Queues, queues);
            typedi_1.default.set(homebrew_plugin_1.IMessagingManager, typedi_1.default.get(messaging_manager_1.MessagingManager));
            typedi_1.default.set(homebrew_plugin_1.ILogger, typedi_1.default.get(logger_1.Logger));
            typedi_1.default.import([
                ...pluginConfig.sensors,
                ...pluginConfig.actors,
                ...pluginConfig.logics,
            ]);
            const sensorTypesService = typedi_1.default.get(sensor_types_1.SensorTypeService);
            typedi_1.default.set('sensorTypes', yield sensorTypesService.getSensorTypeIds());
        });
    }
}
exports.OtaContainer = OtaContainer;
//# sourceMappingURL=container.js.map