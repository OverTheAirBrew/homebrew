import { InjectMany, Service } from 'typedi';
import { ACTOR_TOKEN, LOGIC_TOKEN, SENSOR_TOKEN } from '../plugin';
import { Actor } from '../plugin/abstractions/actor';
import { Logic } from '../plugin/abstractions/logic';
import { Sensor } from '../plugin/abstractions/sensor';
import { Peripheral } from '../plugin/properties';

// const FALLBACK_LANGUAGE = 'en';

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

@Service()
export class TranslationsService {
  constructor(
    @InjectMany(SENSOR_TOKEN) private sensorTypes: Sensor<any>[],
    @InjectMany(ACTOR_TOKEN) private actorTypes: Actor<any>[],
    @InjectMany(LOGIC_TOKEN) private logicTypes: Logic<any>[],
  ) {}

  async generateTranslations() {
    const translations = {};
    const namespaces = [];
    const locales = [];

    const types: Peripheral[] = [
      ...this.sensorTypes,
      ...this.logicTypes,
      ...this.actorTypes,
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
