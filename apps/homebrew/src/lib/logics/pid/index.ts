import { Injectable } from '@nestjs/common';
import { Logic } from '../../plugin/abstractions/logic';
import { NumberProperty } from '../../plugin/properties';

export interface IPidLogicParams {
  p: number;
  i: number;
  d: number;
  max?: number;

  e?: number;
}

@Injectable()
export class PidLogic extends Logic<IPidLogicParams> {
  constructor() {
    super('pid', [
      new NumberProperty('p', true),
      new NumberProperty('i', true),
      new NumberProperty('d', true),
      new NumberProperty('maxOutput', false),
    ]);
  }

  private _maxP = 1000; // Limit the maximum value of the abs Proportional (because micro controller registers)
  private _maxI = 1000; // Limit the maximum value of the abs Integral (because micro controller registers)
  private _maxD = 1000; // Limit the maximum value of the abs Derivative (because micro controller registers)
  private _maxU = 1000;
  private sample_time = 5;

  protected async process(
    params: IPidLogicParams,
    currentTemp: number,
    targetTemp: number,
  ) {
    return await this.calculate(params, currentTemp, targetTemp);
  }

  private async calculate(
    params: IPidLogicParams,
    currentTemp: number,
    targetTemp: number,
  ) {
    const kp = params.p;
    const ki = params.i;
    const kd = params.d;
    const max = params.max || 4000;

    const ePrev = params.e || 0;
    const e = targetTemp - currentTemp;

    let p = kp * e;

    if (p > this._maxP) {
      p = this._maxP;
    } else if (p < -1 * this._maxP) {
      p = -1 * this._maxP;
    }

    let i = ki * e;
    if (i > this._maxI) {
      i = this._maxI;
    } else if (i < -1 * this._maxI) {
      i = -1 * this._maxI;
    }

    let d = kd * (e - ePrev);

    if (d > this._maxD) {
      d = this._maxD;
    } else if (d < -1 * this._maxD) {
      d = -1 * this._maxD;
    }

    let u = p + i + d;
    if (u > this._maxU) {
      u = this._maxU;
    } else if (u < 0) {
      u = 0;
    }

    const heatTime = (u / 1000) * max;
    const waitTime = this.sample_time - heatTime;

    return {
      heatTime,
      waitTime,
      nextParams: {
        p: kp,
        i: ki,
        d: kd,
        max,
        e,
      },
    };
  }
}
