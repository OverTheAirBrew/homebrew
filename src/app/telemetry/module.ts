import { Module } from '@nestjs/common';
import { Telemetry } from '../../database/models/telemetry';
import { DatabaseModule } from '../../database/module';
import { TelemetryRepository } from '../../lib/constants';
import { TelemetryService } from './service';

@Module({
  imports: [DatabaseModule],
  providers: [
    TelemetryService,
    {
      provide: TelemetryRepository,
      useValue: Telemetry,
    },
  ],
  exports: [TelemetryService],
})
export class TelemetryModule {}
