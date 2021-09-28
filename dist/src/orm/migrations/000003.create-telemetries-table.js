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
const sequelize_1 = require("sequelize");
const TABLE_NAME = 'telemetries';
function up({ context: queryInterface }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.createTable(TABLE_NAME, {
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            sensor_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: { model: 'sensors', key: 'id' },
            },
            reading: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
            },
        });
    });
}
function down({ context: queryInterface }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.dropTable(TABLE_NAME);
    });
}
module.exports = {
    up,
    down,
};
//# sourceMappingURL=000003.create-telemetries-table.js.map