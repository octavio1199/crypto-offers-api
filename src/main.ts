import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableSwaggerConfig } from './common/config/enable-swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') || 8000;
  app.setGlobalPrefix('api');
  enableSwaggerConfig(app);
  await app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port} 🚀`);
  });
}

bootstrap();
