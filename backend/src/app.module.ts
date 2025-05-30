import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { ViewController } from './view.controller';
import { UserModule } from './user/user.module';
import { PitchDeckModule } from './pitch-deck/pitch-deck.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),

    // 👉 Sert les vues statiques si besoin (images, css, etc.)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    UserModule,
    PitchDeckModule,
  ],

  controllers: [
    AppController,
    ViewController, // 👉 Ajout du controller pour servir /login
  ],
})
export class AppModule {}
