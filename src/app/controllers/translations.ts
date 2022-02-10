import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { TranslationsService } from '../lib/translations';

@JsonController('/translations')
@Service()
export class TranslateController {
  constructor(private translationService: TranslationsService) {}

  @Get('/')
  async getTranslations() {
    return await this.translationService.generateTranslations();
  }
}
