import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', process.env.NODE_ENV === 'development' ? 'log' : null],
  });

  /** Swagger 문서 보안을 위한 계정등록, 임시계정으로 추후 환경변수로 이관 */
  app.use(
    '/api',
    expressBasicAuth({
      challenge: true,
      users: { admin: '1234' },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hello Developer API Docs')
    .setDescription('HDev API description')
    .setVersion('1.0')
    .addTag('hdev')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.use(cookieParser());

  /** 테스트 환경에서만 localhost cors 등록 */
  app.enableCors({
    origin: [
      'https://hdev.site',
      process.env.NODE_ENV === 'development' && 'http://localhost:3000',
    ],
    credentials: true,
  });

  await app.listen(5000);
}

bootstrap();
