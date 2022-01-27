import { sync } from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import { normalize } from 'path';
import { Service } from 'typedi';
import { ClassType } from '../../../lib/plugin/class-type';

export interface IOneWireController {
  findDevices(hint?: string): Promise<string[]>;
  getCurrentValue(deviceName: string): Promise<Temperature>;
}

export const IOneWireController =
  class Dummy {} as ClassType<IOneWireController>;

export class Temperature {
  constructor(private _celcius: number) {}

  get celcius() {
    return this._celcius;
  }

  get farenheit() {
    return this._celcius * 1.8 + 32;
  }
}

abstract class BaseController {
  public async getCurrentValue(deviceName: string) {
    const rawData = await this.readData(deviceName);
    const parsedData = await this.parseData(rawData);
    return new Temperature(parsedData);
  }

  protected abstract readData(deviceName: string): Promise<string>;
  protected abstract parseData(rawData: string): Promise<number>;
}

@Service()
export class DS18B20Controller
  extends BaseController
  implements IOneWireController
{
  constructor() {
    super();
  }

  public async findDevices(hint?: string): Promise<string[]> {
    const pattern = hint ?? '/sys/bus/w1/devices/28-*/w1_slave';
    const files = sync(pattern);
    const normalizedFiles = files.map((file) => normalize(file));
    return normalizedFiles;
  }

  protected async readData(deviceName: string) {
    if (!existsSync(deviceName)) {
      throw new Error('One wire device not found');
    }

    return readFileSync(deviceName).toString('utf-8');
  }

  protected async parseData(rawData: string) {
    const data = rawData.split('t=');

    if (data.length !== 2) {
      throw new Error('Raw data is not in the expected format');
    }

    return parseInt(data[1].replace('\n', '')) / 1000;
  }
}

interface IStreamDevice {
  address: string;
  expectedValues: number[];
}

@Service()
export class StreamController
  extends BaseController
  implements IOneWireController
{
  private index = 0;

  constructor(private repeatable: boolean, private devices: IStreamDevice[]) {
    super();
  }

  public async findDevices(hint?: string): Promise<string[]> {
    return this.devices.map((device) => device.address);
  }

  protected async readData(deviceName: string) {
    const values = this.devices.find(
      (dev) => dev.address === deviceName,
    )?.expectedValues;

    if (!values || !values.length || this.index === values.length) {
      throw new Error('No values');
    }

    try {
      return `${values[this.index]}`;
    } finally {
      this.index++;
      if (this.repeatable) {
        this.index %= values.length;
      }
    }
  }

  protected async parseData(rawData: string) {
    return parseInt(rawData);
  }
}
