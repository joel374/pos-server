import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './pipes/validation.pipe';
import { Connection } from 'typeorm';
import { ConfigService } from 'modules/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(app.get(ConfigService).getInt('SERVER_PORT'));
  Logger.log(`Running on port: ${app.get(ConfigService).getInt('SERVER_PORT')}`, 'NestApplication');
}
bootstrap();

export const connections: Map<string, Connection> = new Map();
