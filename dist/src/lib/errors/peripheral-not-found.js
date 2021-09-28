"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralNotFoundError = void 0;
const ota_base_error_1 = require("./ota-base-error");
class PeripheralNotFoundError extends ota_base_error_1.BaseError {
    constructor(id) {
        super(`Peripheral with id ${id} not found`, {
            httpCode: 404,
            errorCode: 'PERIPHERAL_NOT_FOUND',
        });
    }
}
exports.PeripheralNotFoundError = PeripheralNotFoundError;
//# sourceMappingURL=peripheral-not-found.js.map