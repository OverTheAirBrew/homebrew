"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorImplementationNotFoundError = void 0;
const ota_base_error_1 = require("./ota-base-error");
class SensorImplementationNotFoundError extends ota_base_error_1.BaseError {
    constructor(id) {
        super(`Sensor implementation with type ${id} not found`, {
            httpCode: 404,
            errorCode: 'SENSOR_IMPLEMENTATION_NOT_FOUND',
        });
    }
}
exports.SensorImplementationNotFoundError = SensorImplementationNotFoundError;
//# sourceMappingURL=sensor-implementation-not-found.js.map