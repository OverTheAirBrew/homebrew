import { Module } from '@nestjs/common';
import { TranslationsController } from './controller';
import { TranslationsService } from './service';

@Module({
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
