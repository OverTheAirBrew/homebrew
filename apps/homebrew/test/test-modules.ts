import { ModuleMetadata, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { controllersList } from '../src/app.module';
import { DatabaseModule } from '../src/database/module';
import { ServicesModule } from '../src/lib/services/module';
import { SocketGatewayModule } from '../src/socket-gateway/module';

export const TEST_MODULES: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    SocketGatewayModule,
    ServicesModule,
  ],
  controllers: [...controllersList],
};

export async function createApplication() {
  const moduleFixtures = await Test.createTestingModule(TEST_MODULES).compile();
  const app = moduleFixtures.createNestApplication();

  useContainer(app.select(ServicesModule), {
    fallbackOnErrors: true,
    fallback: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  return {
    moduleFixtures,
    app,
  };
}
