import { ModuleMetadata, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { controllersList, importsList } from '../../src/app.module';

export const TEST_MODULES: ModuleMetadata = {
  imports: [...importsList],
  controllers: [...controllersList],
};

export async function createApplication() {
  const moduleFixtures = await Test.createTestingModule(TEST_MODULES).compile();
  const app = moduleFixtures.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  return {
    moduleFixtures,
    app,
  };
}
