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
exports.createValidationErrorWithConfigError = void 0;
const fluent_ts_validator_1 = require("fluent-ts-validator");
const validation_error_1 = require("./validation-error");
function createValidationErrorWithConfigError(failures, configValid, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationResult = new fluent_ts_validator_1.ValidationResult();
        validationResult.addFailures(failures);
        if (!configValid) {
            validationResult.addFailures([
                new fluent_ts_validator_1.ValidationFailure('', 'config', config, 'CONFIG_INVALID'),
            ]);
        }
        return new validation_error_1.ValidationError(validationResult);
    });
}
exports.createValidationErrorWithConfigError = createValidationErrorWithConfigError;
//# sourceMappingURL=create-validation-error-with-config-error.js.map