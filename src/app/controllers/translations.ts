import { Get, JsonController, Param } from 'routing-controllers';
import { Service } from 'typedi';
import { SensorTypesService } from '../lib/sensor-types';

@JsonController('/translations')
@Service()
export class TranslationsController {
  constructor(private sensorTypeService: SensorTypesService) {}

  @Get('/:language/:namespace')
  async getTranslations(
    @Param('language') language: string,
    @Param('namespace') namespace: string,
  ) {
    const sensorTranslations =
      await this.sensorTypeService.getTranslationsForSensor(
        namespace,
        language,
      );

    return {
      ...sensorTranslations,
    };
  }
}
