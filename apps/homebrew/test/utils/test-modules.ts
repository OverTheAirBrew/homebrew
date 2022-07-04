import { ModuleMetadata, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { ServicesModule } from '../../src/lib/services/module';

import { controllersList, importsList } from '../../src/app.module';

export const TEST_MODULES: ModuleMetadata = {
  imports: [...importsList],
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
