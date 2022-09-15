import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DtoValidationPipe } from './validators/input-validation.pipe';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new DtoValidationPipe());
  app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(configService.get('PORT'));
}
bootstrap();
