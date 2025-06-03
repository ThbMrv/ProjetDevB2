import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { ViewController } from './view.controller';
import { LoginController } from './login.controller';
import { ProfileController } from './profile.controller'; // 👈 Ajouté ici

import { UserModule } from './user/user.module';
import { PitchDeckModule } from './pitch-deck/pitch-deck.module';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MeetingModule } from './meeting/meeting.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { OfferModule } from './offer/offer.module';

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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Tous tes modules fonctionnels
    UserModule,
    PitchDeckModule,
    CommentModule,
    FavoriteModule,
    MeetingModule,
    MessageModule,
    NotificationModule,
    OfferModule,
  ],
  controllers: [
    AppController,
    ViewController,
    LoginController,
    ProfileController, // ✅ Ajouté ici pour la route /profile
  ],
})
export class AppModule {}
