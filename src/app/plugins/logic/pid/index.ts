import { Logic, NumberProperty } from '@overtheairbrew/homebrew-plugin';
import { Service } from 'typedi';

interface IPidParams {
  p: number;
  i: number;
  d: number;

  _e?: number;
}

@Service({ id: 'logic', multiple: true })
export class PidLogic extends Logic {
  private _MaxP = 1000;                            // Limit the maximum value of the abs Proportional (because micro controller registers)
  private _MaxI = 1000;                            // Limit the maximum value of the abs Integral (because micro controller registers)
  private _MaxD = 1000;                            // Limit the maximum value of the abs Derivative (because micro controller registers)
  private _MaxU = 1000;

  constructor() {
    super('pid', [
      new NumberProperty('p', false),
      new NumberProperty('i', false),
      new NumberProperty('d', false),
    ]);
  }

  public async run(
    params: IPidParams,
    currentTemp:number,
    targetTemp: number,
  ): Promise<{ heatTime: number; waitTime: number; opts: any }> {
   const {heatTime, prev} = await this.calculate(params, currentTemp, targetTemp);

    return {
      heatTime,
      waitTime: 0,
      opts: {
        e: prev
      }
    };
  }

  private async calculate(params: IPidParams, currentTemp:number, targetTemp:number){
    const kP = params.p;
    const kI = params.il;
    const kD = params.d;

    let ePrev = params._e || 0;

    let e = targetTemp - currentTemp;

    let p = kP * e;b
    if(p > this._MaxP){
      p = this._MaxP;
    }else if(p < (-1 * this._MaxP)){
      p = -1 * this._MaxP;
    }

    let i =kI * (e - ePrev)
    if(i > this._MaxI) {
      i = this._MaxI
    }else if(i < (-1 * this._MaxI)){
      i = -1 * this._MaxI
    }

    let d = kD - (e - ePrev);
    if(d > this._MaxD){
      d = this._MaxD
    }else if(d < (-1 * this._MaxD)){
      d = -1 * this._MaxD
    }

    let u = p + i + d;
    if (u > this._MaxU) {
      u = this._MaxU;
    } else if (u < 0) {
      u = 0;
    }

    return { heatTime: ((u / 1000) * 4000), prev: e };
  }

  }
}
