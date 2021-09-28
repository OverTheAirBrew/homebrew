"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralImplementationNotFoundError = void 0;
const ota_base_error_1 = require("./ota-base-error");
class PeripheralImplementationNotFoundError extends ota_base_error_1.BaseError {
    constructor(id) {
        super(`Peripheral implementation with type ${id} not found`, {
            httpCode: 404,
            errorCode: 'PERIPHERAL_IMPLEMENTATION_NOT_FOUND',
        });
    }
}
exports.PeripheralImplementationNotFoundError = PeripheralImplementationNotFoundError;
//# sourceMappingURL=peripheral-implementation-not-found.js.map