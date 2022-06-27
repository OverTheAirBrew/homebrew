import { Inject, Injectable } from '@nestjs/common';
import { IDevices, ILogics } from '../../../lib/constants';
import { ILogic } from '../../../lib/plugin/abstractions/logic';
import { IDevice } from '../../devices/base-device';

const availableLocalizations = ['en'];

const commonTranslations: Record<string, Record<string, any>> = {
  en: {
    interpolation: {
      'is-required': '{{name}} is required',
      'new-thing': 'Create a new {{type}}',
      'update-thing': 'Update {{type}}',
      'select-type-message': 'Please select a {{type}} to configure',
      list: '{{type}} list',
    },
    global: {
      name: 'Name',
    },
    sensors: {
      name: 'Sensor',
      type: 'Sensor Type',
    },
    actors: {
      name: 'Actor',
      type: 'Actor Type',
    },
    kettles: {
      name: 'Kettle',
    },
    logics: {
      type: 'Logic Type',
    },
    heaters: {
      name: 'Heater',
    },
  },
};

@Injectable()
export class TranslationsService {
  constructor(
    // @Inject(IActors) private actorTypes: IActor<any>[],
    // @Inject(ISensors) private sensorTypes: ISensor<any>[],
    @Inject(ILogics) private logicTypes: ILogic<any>[],
    @Inject(IDevices) private deviceTypes: IDevice<any>[],
  ) {}

  async generateTranslations() {
    let translations = {};
    const namespaces = [];
    const locales = availableLocalizations;

    for (const type of this.logicTypes) {
      for (const locale of locales) {
        translations[`${locale}/${type.name}`] = type.localizations[locale];
        namespaces.push(type.name);
      }
    }

    for (const deviceType of this.deviceTypes) {
      const sensors = await deviceType.getRawSensorTypes();
      const actors = await deviceType.getRawActorTypes();

      let deviceTranslations = {};

      for (const locale of locales) {
        let localeTranslations = {};

        for (const peripheral of [...sensors, ...actors]) {
          localeTranslations[peripheral.name] =
            peripheral.localizations[locale];
        }

        deviceTranslations[`${locale}/${deviceType.name}`] = localeTranslations;
      }

      translations = {
        ...translations,
        ...deviceTranslations,
      };

      namespaces.push(deviceType.name);
    }

    // let types: Peripheral[] = [...this.logicTypes, ...this.deviceTypes];

    // let devicePeripherals: Record<string, Peripheral[]> = {};

    // for (const device of this.deviceTypes) {
    //   const sensors = await device.getRawSensorTypes();
    //   const actors = await device.getRawActorTypes();

    //   devicePeripherals[device.name] = [...sensors, ...actors];
    // }

    // for (const devicePeripheral of Object.keys(devicePeripherals)) {
    //   const peripheralTypes = devicePeripherals[devicePeripheral];

    //   for (const pt of peripheralTypes) {
    //     for (const key of Object.keys(pt.localizations)) {
    //       translations[`${key}/${devicePeripheral}/${pt.name}`] =
    //         pt.localizations[key];
    //       locales.push(key);
    //       namespaces.push(`${pt.name}`);
    //     }
    //   }
    // }

    for (const key of Object.keys(commonTranslations)) {
      translations[`${key}/common`] = commonTranslations[key];
      namespaces.push('common');
    }

    return {
      translations,
      namespaces,
      locales: [...new Set([...locales])],
    };
  }
}
