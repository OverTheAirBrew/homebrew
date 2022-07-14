import { Injectable } from '@nestjs/common';
import { Sensor, StringProperty } from '@ota-internal/shared';

interface IDummySensorProps {
  values: string;
}

@Injectable()
export class DummySensor extends Sensor<IDummySensorProps> {
  constructor() {
    super('dummy', [
      new StringProperty('values', true, (value: string) =>
        this.validateValues(value),
      ),
    ]);
  }

  private async validateValues(values: string) {
    const valuesSplit = values.split(',');
    return valuesSplit.every((val) => parseInt(val) || false);
  }

  protected async process(params: IDummySensorProps) {
    const values = params.values.split(',').map((val) => parseInt(val));
    return values[Math.floor(Math.random() * values.length)];
  }
}
