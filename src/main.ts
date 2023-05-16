import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', process.env.NODE_ENV === 'development' ? 'log' : null],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hello Developer API Docs')
    .setDescription('HDev API description')
    .setVersion('1.0')
    .addTag('hdev')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.use(cookieParser());

  app.enableCors({
    origin: ['https://hdev.site', 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(5000);
}

bootstrap();
