import { Module } from '@nestjs/common';
import { TelemetryModule } from '../app/telemetry/module';
import { SocketGatewayModule } from '../socket-gateway/module';
import { SensorReadingWorkerService } from './sensor-reading/service';

@Module({
  providers: [SensorReadingWorkerService],
  imports: [SocketGatewayModule, TelemetryModule],
})
export class WorkersModule {}
