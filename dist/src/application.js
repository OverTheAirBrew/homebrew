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
exports.OtaHomebrewApp = void 0;
const node_typedi_in_memory_queue_1 = require("@overtheairbrew/node-typedi-in-memory-queue");
const socket_io_1 = require("@overtheairbrew/socket-io");
const body_parser_1 = require("body-parser");
const storage_1 = require("class-transformer/cjs/storage");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const cors = require("cors");
const cron_typedi_decorators_1 = require("cron-typedi-decorators");
const express = require("express");
// import { sync } from 'glob';
const fg = require("fast-glob");
const http_1 = require("http");
const path_1 = require("path");
const version = require("project-version");
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
require("source-map-support/register");
const stream_1 = require("stream");
const swagger_ui_express_1 = require("swagger-ui-express");
const typedi_1 = require("typedi");
const container_1 = require("./lib/container");
const logger_1 = require("./lib/logger");
const programatic_migrate_1 = require("./orm/programatic-migrate");
const sequelize_wrapper_1 = require("./orm/sequelize-wrapper");
require('express-async-errors');
const UI_PACKAGE = '@overtheairbrew/homebrew-ui';
class OtaHomebrewApp extends stream_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.disableMigrations = false;
        this.isListening = false;
        this.paths = {
            hooks: '',
            controllers: '',
            workers: '',
        };
        this.pluginConfiguration = {
            sensors: [],
            actors: [],
            logics: [],
        };
        this.expressApp = express();
        this.expressApp.use(cors());
        this.paths['controllers'] = path_1.join(this.options.cwd || __dirname, 'controllers', '**', '*.js');
        this.paths['hooks'] = path_1.join(this.options.cwd || __dirname, 'hooks', '**', '*.js');
        this.paths['workers'] = path_1.join(this.options.cwd || __dirname, 'workers', '**', '*.js');
        this.routingControllersOptions = {
            controllers: [this.paths['controllers']],
            routePrefix: '/server',
            middleware: [body_parser_1.json()],
        };
        const httpServer = http_1.createServer(this.expressApp);
        const queues = new node_typedi_in_memory_queue_1.Queues();
        const ready = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.loadPlugins(this.options.pluginPatterns, this.options.cwd);
                yield this.setupContainer(options, httpServer, queues, this.pluginConfiguration);
                routing_controllers_1.useContainer(typedi_1.Container);
                cron_typedi_decorators_1.useContainer(typedi_1.Container);
                node_typedi_in_memory_queue_1.useContainer(typedi_1.Container);
                yield this.runMigrations();
                cron_typedi_decorators_1.registerController([this.paths['hooks']]);
                node_typedi_in_memory_queue_1.registerController([this.paths['workers']], queues);
                yield this.loadAllServerControllers();
                yield this.createDocs();
                if (require.resolve(UI_PACKAGE)) {
                    const { initUi } = require(UI_PACKAGE);
                    initUi(this.expressApp);
                }
                typedi_1.Container.get(socket_io_1.SocketIo);
                resolve(undefined);
            }
            catch (err) {
                reject(err);
            }
        }));
        ready.then(() => {
            logger_1.logger.info(`server listening on ${this.options.port}`);
            httpServer.listen(this.options.port);
            this.emit('application-started');
            this.isListening = true;
        });
    }
    loadPlugins(patterns, cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            const plugins = yield fg(patterns, {
                onlyDirectories: true,
                cwd,
            });
            for (const plugin of plugins) {
                const pluginPath = plugin.replace('node_modules/', '');
                const pluginConfig = require(pluginPath).default;
                this.pluginConfiguration.sensors =
                    this.pluginConfiguration.sensors.concat(pluginConfig.sensors || []);
                this.pluginConfiguration.actors = this.pluginConfiguration.actors.concat(pluginConfig.actors || []);
                this.pluginConfiguration.logics = this.pluginConfiguration.logics.concat(pluginConfig.logics || []);
            }
        });
    }
    setupContainer(options, httpServer, queues, pluginConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield container_1.OtaContainer.setupContainer(httpServer, options.database, queues, pluginConfiguration);
        });
    }
    createDocs() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemas = class_validator_jsonschema_1.validationMetadatasToSchemas({
                classTransformerMetadataStorage: storage_1.defaultMetadataSrotage,
                refPointerPrefix: '#/components/schemas/',
            });
            const storage = routing_controllers_1.getMetadataArgsStorage();
            const spec = routing_controllers_openapi_1.routingControllersToSpec(storage, this.routingControllersOptions, {
                components: {
                    schemas,
                },
                info: {
                    description: 'Api docs for this open source project',
                    title: 'OverTheAir Homebrew',
                    version,
                },
            });
            this.expressApp.use('/docs', swagger_ui_express_1.serve, swagger_ui_express_1.setup(spec));
        });
    }
    runMigrations() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.disableMigrations)
                return;
            logger_1.logger.info('Running migrations');
            const wrapper = typedi_1.Container.get(sequelize_wrapper_1.SequelizeWrapper);
            const migration = new programatic_migrate_1.ProgramaticMigate(wrapper.sequelize, logger_1.logger);
            const ranMigrations = yield migration.up();
            logger_1.logger.info('Migrations finished', ranMigrations);
        });
    }
    loadAllServerControllers() {
        return __awaiter(this, void 0, void 0, function* () {
            routing_controllers_1.useExpressServer(this.expressApp, this.routingControllersOptions);
        });
    }
}
exports.OtaHomebrewApp = OtaHomebrewApp;
//# sourceMappingURL=application.js.map