import { NestFactory } from '@nestjs/core';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  setupGracefulShutdown({ app });
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
