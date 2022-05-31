import { Inject, Injectable } from '@nestjs/common';
import { IActors, ILogics, ISensors } from '../../lib/constants';
import { IActor } from '../../lib/plugin/abstractions/actor';
import { ILogic } from '../../lib/plugin/abstractions/logic';
import { ISensor } from '../../lib/plugin/abstractions/sensor';
import { Peripheral } from '../../lib/plugin/properties';

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
    @Inject(IActors) private actorTypes: IActor<any>[],
    @Inject(ISensors) private sensorTypes: ISensor<any>[],
    @Inject(ILogics) private logicTypes: ILogic<any>[],
  ) {}

  async generateTranslations() {
    const translations = {};
    const namespaces = [];
    const locales = [];

    const types: Peripheral[] = [
      ...this.sensorTypes,
      ...this.actorTypes,
      ...this.logicTypes,
    ];

    for (const type of types) {
      for (const key of Object.keys(type.localizations)) {
        translations[`${key}/${type.name}`] = type.localizations[key];
        locales.push(key);
        namespaces.push(`${type.name}`);
      }
    }

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
