import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';
import { loadBootEnv } from './env.ts';

async function bootstrap() {
  const env = loadBootEnv();
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT);
}
void bootstrap();
