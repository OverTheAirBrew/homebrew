import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TranslationsService } from './service';

@ApiTags('translations')
@Controller('translations')
export class TranslationsController {
  constructor(private service: TranslationsService) {}

  @Get('/')
  async getTranslations() {
    return await this.service.generateTranslations();
  }
}
