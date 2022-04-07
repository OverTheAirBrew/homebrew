import { Module } from '@nestjs/common';
import { SocketGatewayModule } from '../../socket-gateway/module';
import { WorkerSensorReadingsToSocketService } from './service';

@Module({
  providers: [WorkerSensorReadingsToSocketService],
  imports: [SocketGatewayModule],
})
export class SensorReadingsToSocketModule {}
