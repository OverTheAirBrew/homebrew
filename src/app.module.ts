import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActorTypesModule } from './app/actor-types/module';
import { ActorModule } from './app/actor/module';
import { SensorTypesModule } from './app/sensor-types/module';
import { SensorModule } from './app/sensor/module';
import { PluginsModule } from './plugins';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PluginsModule.register(),
    ActorTypesModule,
    ActorModule,
    SensorTypesModule,
    SensorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
