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
exports.ProgramaticMigate = void 0;
const umzug_1 = require("umzug");
class ProgramaticMigate {
    constructor(connection, logger) {
        this.connection = connection;
        this.umzug = new umzug_1.Umzug({
            migrations: { glob: '**/migrations/*.js' },
            context: this.connection.getQueryInterface(),
            storage: new umzug_1.SequelizeStorage({ sequelize: this.connection }),
            logger: {
                debug: (msg) => logger.debug(JSON.stringify(msg)),
                error: (msg) => logger.error(new Error(JSON.stringify(msg))),
                info: (msg) => {
                    logger.info(JSON.stringify(msg));
                },
                warn: (msg) => logger.warn(JSON.stringify(msg)),
            },
        });
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const migratedFiles = yield this.umzug.up();
            return migratedFiles.map((file) => file.name);
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.umzug.down();
        });
    }
}
exports.ProgramaticMigate = ProgramaticMigate;
//# sourceMappingURL=programatic-migrate.js.map