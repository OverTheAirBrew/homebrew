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
exports.SequelizeWrapper = void 0;
const path_1 = require("path");
const sequelize_typescript_1 = require("sequelize-typescript");
const typedi_1 = require("typedi");
const url_1 = require("url");
const config_1 = require("./config");
let SequelizeWrapper = class SequelizeWrapper {
    constructor(options) {
        const config = this.getConfigFromOptions(options);
        this._internalSequelize = new sequelize_typescript_1.Sequelize(Object.assign(Object.assign({}, config), { models: [path_1.join(options.cwd || __dirname, 'models', '*.js')] }));
    }
    get sequelize() {
        return this._internalSequelize;
    }
    getConfigFromOptions(options) {
        if (options.dialect === 'mysql') {
            return this.getMysqlOptions(options);
        }
        if (options.dialect === 'sqlite') {
            return this.getSqlLiteOptions(options);
        }
    }
    getSqlLiteOptions(options) {
        if (!require.resolve('sqlite3')) {
            throw new Error('Please install sqlite3 package to use sqllite storage');
        }
        return Object.assign(Object.assign({}, config_1.BASE_CONFIG), { dialect: 'sqlite', storage: options.storage });
    }
    getMysqlOptions(options) {
        if (!require.resolve('mysql2')) {
            throw new Error('Please install the mysql2 package to use mysql storage');
        }
        const { hostname: host, port, username, password, pathname, } = new url_1.URL(options.url);
        return Object.assign(Object.assign({}, config_1.BASE_CONFIG), { dialect: 'mysql', host, port: parseInt(port), database: pathname.substring(1, pathname.length), username,
            password });
    }
};
SequelizeWrapper = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('databaseOptions')),
    __metadata("design:paramtypes", [Object])
], SequelizeWrapper);
exports.SequelizeWrapper = SequelizeWrapper;
//# sourceMappingURL=sequelize-wrapper.js.map