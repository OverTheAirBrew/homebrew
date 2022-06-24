import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from '../src/lib/services/module';
import { PluginsModule } from '../src/plugins';
import { SocketGateway } from '../src/socket-gateway/gateway';

export const TEST_MODULES = [
  ConfigModule.forRoot(),
  PluginsModule.register(),
  SocketGateway,
  ServicesModule,
];
