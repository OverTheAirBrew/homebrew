import { Module } from '@nestjs/common';
import { ActorController } from './app/actors';
import { HealthController } from './app/health';
import { SensorController } from './app/sensors';
import { ActorModule } from './lib/actors/module';
import { SensorModule } from './lib/sensors/module';

export const controllersList = [
  SensorController,
  ActorController,
  HealthController,
];

export const importsList = [SensorModule, ActorModule];

@Module({
  imports: [...importsList],
  controllers: [...controllersList],
  providers: [],
})
export class AppModule {}
