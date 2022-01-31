import { SensorService } from '../../../lib/plugin';
import { Sensor } from '../../../lib/plugin/abstractions/sensor';
import { IHttpClient } from '../../../lib/plugin/http-client';
import {
  SelectBoxProperty,
  StringProperty,
} from '../../../lib/plugin/properties';

interface IPlaatoKegSensorParams {
  pin: string;
  apiKey: string;
}

const localizations = {
  en: {
    'api-key': 'Api Key',
    pin: 'Pin',
  },
  fr: {
    'api-key': 'Clé API',
    pin: 'Épingler',
  },
};

@SensorService()
export class PlaatoKegSensor extends Sensor<IPlaatoKegSensorParams> {
  constructor(private httpClient: IHttpClient) {
    super(
      'plaato-keg',
      [
        new StringProperty('api-key', true),
        new SelectBoxProperty('pin', true, () => [
          {
            key: '48',
            value: '% beer left',
          },
          {
            key: '51',
            value: 'amount left',
          },
        ]),
      ],
      localizations,
    );
  }

  protected async process(params: IPlaatoKegSensorParams): Promise<number> {
    const plaatoResponse = await this.httpClient.get<string | string[]>(
      `http://plaato.blynk.cc/${params.apiKey}/get/v${params.pin}`,
    );

    if (Array.isArray(plaatoResponse)) {
      return parseFloat(plaatoResponse[0]);
    }

    return parseFloat(plaatoResponse);
  }
}
