import { InjectMany, Service } from 'typedi';
import { ACTOR_TOKEN, SENSOR_TOKEN } from '../plugin';
import { Actor } from '../plugin/abstractions/actor';
import { Sensor } from '../plugin/abstractions/sensor';

// const FALLBACK_LANGUAGE = 'en';

@Service()
export class TranslationsService {
  constructor(
    @InjectMany(SENSOR_TOKEN) private sensorTypes: Sensor<any>[],
    @InjectMany(ACTOR_TOKEN) private actorTypes: Actor<any>[],
  ) {}

  // async getTranslations(language: string, namespace: string) {
  //   let localizations: PeripheralLocalizations;

  //   if (namespace.includes('-sensor')) {
  //     const sensorType = await this.sensorTypeService.getRawSensorTypeById(
  //       namespace,
  //     );
  //     localizations = sensorType.localizations;
  //   } else if (namespace.includes('-actor')) {
  //     const actorType = await this.actorTypeService.getRawActorTypeById(
  //       namespace,
  //     );
  //     localizations = actorType.localizations;
  //   } else {
  //     throw new Error(`Unknown namespace: ${namespace}`);
  //   }

  //   return localizations[language] || localizations[FALLBACK_LANGUAGE];
  // }

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

    for (const locale of locales) {
      translations[`${locale}/common`] = {};
    }

    return {
      translations,
      namespaces,
      locales: new Set([...locales]),
    };
  }
}
