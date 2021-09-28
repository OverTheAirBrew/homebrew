"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
class BaseError extends Error {
    constructor(message, opts) {
        super(message);
        this.httpCode = opts.httpCode;
        this.errorCode = opts.errorCode;
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=ota-base-error.js.map