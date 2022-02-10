import { InjectMany, Service } from 'typedi';
import { ACTOR_TOKEN, SENSOR_TOKEN } from '../plugin';
import { Actor } from '../plugin/abstractions/actor';
import { Sensor } from '../plugin/abstractions/sensor';

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
  },
};

@Service()
export class TranslationsService {
  constructor(
    @InjectMany(SENSOR_TOKEN) private sensorTypes: Sensor<any>[],
    @InjectMany(ACTOR_TOKEN) private actorTypes: Actor<any>[],
  ) {}

  async generateTranslations() {
    const translations = {};
    const namespaces = [];
    const locales = [];

    for (const st of this.sensorTypes) {
      for (const key of Object.keys(st.localizations)) {
        translations[`${key}/${st.name}`] = st.localizations[key];
        locales.push(key);
        namespaces.push(`${st.name}`);
      }
    }

    for (const at of this.actorTypes) {
      for (const key of Object.keys(at.localizations)) {
        translations[`${key}/${at.name}`] = at.localizations[key];
        locales.push(key);
        namespaces.push(`${at.name}`);
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
