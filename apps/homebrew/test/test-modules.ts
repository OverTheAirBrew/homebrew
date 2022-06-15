import { ConfigModule } from '@nestjs/config';
import { ActorTypesModule } from '../src/app/actor-types/module';
import { ActorModule } from '../src/app/actor/module';
import { KettleModule } from '../src/app/kettle/module';
import { LogicTypesModule } from '../src/app/logic-types/module';
import { SensorTypesModule } from '../src/app/sensor-types/module';
import { SensorModule } from '../src/app/sensor/module';
import { TelemetryModule } from '../src/app/telemetry/module';
import { TranslationsModule } from '../src/app/translations/module';
import { PluginsModule } from '../src/plugins';
import { SocketGateway } from '../src/socket-gateway/gateway';

export const TEST_MODULES = [
  ConfigModule.forRoot(),
  PluginsModule.register(),
  ActorTypesModule,
  ActorModule,
  SensorTypesModule,
  LogicTypesModule,
  KettleModule,
  SensorModule,
  SocketGateway,
  TelemetryModule,
  TranslationsModule,
];
