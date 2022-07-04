import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.listen(3000);
}

bootstrap();
