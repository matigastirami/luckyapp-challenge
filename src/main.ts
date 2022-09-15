import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DtoValidationPipe } from './pipe/input-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new DtoValidationPipe());
  app.enableShutdownHooks();
  await app.listen(configService.get('PORT'));
}
bootstrap();
