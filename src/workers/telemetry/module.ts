import { Module } from '@nestjs/common';
import { TelemetryModule } from '../../app/telemetry/module';
import { WorkerTelemetryService } from './service';

@Module({
  providers: [WorkerTelemetryService],
  imports: [TelemetryModule],
})
export class WorkerTelemetryModule {}
