"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
class BaseModel extends sequelize_typescript_1.Model {
    toJSON() {
        return super.get({ plain: true });
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=base-model.js.map