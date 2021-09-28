"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_CONFIG = void 0;
const logger_1 = require("../lib/logger");
exports.BASE_CONFIG = {
    logging: (msg) => logger_1.logger.debug(msg),
    define: {
        timestamps: true,
    },
    dialectOptions: {
        charset: 'utf8mb4',
    },
    repositoryMode: true,
};
//# sourceMappingURL=config.js.map