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
exports.SensorReadingHooks = void 0;
const cron_typedi_decorators_1 = require("cron-typedi-decorators");
const typedi_1 = require("typedi");
const cron_1 = require("../lib/cron");
let SensorReadingHooks = class SensorReadingHooks {
    testing() {
        console.log('a');
    }
};
__decorate([
    cron_typedi_decorators_1.Cron('sensor-readings', cron_1.CronSchedules.EVERY_SECOND),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SensorReadingHooks.prototype, "testing", null);
SensorReadingHooks = __decorate([
    cron_typedi_decorators_1.CronController('sensor-readings'),
    typedi_1.Service()
], SensorReadingHooks);
exports.SensorReadingHooks = SensorReadingHooks;
//# sourceMappingURL=sensor-reading.js.map