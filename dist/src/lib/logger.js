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
exports.logger = exports.Logger = void 0;
const typedi_1 = require("typedi");
const winston_1 = require("winston");
let Logger = class Logger {
    constructor(options) {
        this._logger = winston_1.createLogger({
            level: options.level,
            format: winston_1.format.json(),
            defaultMeta: {
                service: options.serviceName,
                environment: options.node_env,
            },
            transports: [
                new winston_1.transports.Console({
                    level: options.level,
                }),
            ],
        });
    }
    debug(message, ...meta) {
        this._logger.debug(message, ...meta);
    }
    info(message, ...meta) {
        this._logger.info(message, ...meta);
    }
    warn(message, ...meta) {
        this._logger.warn(message, ...meta);
    }
    error(error, ...meta) {
        this._logger.error(error.message, Object.assign({ stack: error.stack }, ...meta));
    }
};
Logger = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('loggingOptions')),
    __metadata("design:paramtypes", [Object])
], Logger);
exports.Logger = Logger;
const LOG_LEVEL = process.env.LOGGING_LEVEL || 'error';
exports.logger = new Logger({
    serviceName: 'api',
    node_env: process.env.NODE_ENV,
    level: LOG_LEVEL,
});
//# sourceMappingURL=logger.js.map