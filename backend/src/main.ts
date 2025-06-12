import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.use(
    session({
      secret: 'INVESTNET_SECRET_KEY',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1h
        secure: false,
      },
    }),
  );


  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerHelper('eq', (a: any, b: any) => a === b);

  // 🌐 Swagger
  const config = new DocumentBuilder()
    .setTitle('Investhet API')
    .setDescription('Documentation auto de ton API REST NestJS')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
