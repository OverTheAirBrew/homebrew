import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { controllersList } from '../src/app.module';
import { DatabaseModule } from '../src/database/module';
import { ServicesModule } from '../src/lib/services/module';
import { SocketGateway } from '../src/socket-gateway/gateway';

export const TEST_MODULES: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    SocketGateway,
    ServicesModule,
  ],
  controllers: [...controllersList],
};
