import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const enableSwaggerConfig = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Race Engineering API')
    .setDescription('Documentation for Race Engineering API')
    .setVersion(process.env.npm_package_version || '1.0.0')
    .addServer('/api')
    .addServer('/')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
};
