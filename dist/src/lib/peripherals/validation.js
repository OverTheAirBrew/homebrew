"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralsValidator = void 0;
const fluent_ts_validator_1 = require("fluent-ts-validator");
const typedi_1 = require("typedi");
let PeripheralsValidator = class PeripheralsValidator extends fluent_ts_validator_1.AbstractValidator {
    constructor() {
        super();
    }
};
PeripheralsValidator = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], PeripheralsValidator);
exports.PeripheralsValidator = PeripheralsValidator;
// class GpioConfigValidator extends AbstractValidator<{ gpio: number }> {
//   constructor() {
//     super();
//     this.validateIfNumber((x) => x.gpio)
//       .isDefined()
//       .isLessThan(20)
//       .isGreaterThan(0)
//       .withFailureCode('GPIO_NUMBER_IS_NOT_IN_RANGE');
//   }
// }
//# sourceMappingURL=validation.js.map