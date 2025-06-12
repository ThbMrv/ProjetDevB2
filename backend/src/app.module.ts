import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { ViewController } from './view.controller';
import { LoginController } from './login.controller';
import { ProfileController } from './profile.controller';

import { UserModule } from './user/user.module';
import { PitchDeckModule } from './pitch-deck/pitch-deck.module';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MeetingModule } from './meeting/meeting.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { OfferModule } from './offer/offer.module';

import { PitchDeck } from './pitch-deck/pitch-deck.entity';
import { Favorite } from './favorite/favorite.entity';
import { Offer } from './offer/offer.entity';
import { Notification } from './notification/notification.entity';
import { Message } from './message/message.entity';
import { User } from './user/user.entity';
import { Meeting } from './meeting/meeting.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      synchronize: false,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    UserModule,
    PitchDeckModule,
    CommentModule,
    FavoriteModule,
    MeetingModule,
    MessageModule,
    NotificationModule,
    OfferModule,

    TypeOrmModule.forFeature([PitchDeck, Favorite, Offer, Notification, Message, User, Meeting]),

  ],
  controllers: [
    AppController,
    ViewController,
    LoginController,
    ProfileController,
  ],
})
export class AppModule {}
