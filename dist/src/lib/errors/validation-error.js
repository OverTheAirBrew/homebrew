"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const ota_base_error_1 = require("./ota-base-error");
class ValidationError extends ota_base_error_1.BaseError {
    constructor(failure) {
        var _a, _b;
        const failures = failure.getFailures();
        super(((_a = failures[0]) === null || _a === void 0 ? void 0 : _a.message) || 'unknown error', {
            httpCode: 400,
            errorCode: ((_b = failures[0]) === null || _b === void 0 ? void 0 : _b.code) || 'UNKNOWN ERROR',
        });
        this.failures = failures;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation-error.js.map