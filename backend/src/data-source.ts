import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Meeting } from './meeting/meeting.entity';
import { PitchDeck } from './pitch-deck/pitch-deck.entity';
import { Offer } from './offer/offer.entity';
import { Comment } from './comment/comment.entity';
import { Message } from './message/message.entity';
import { Favorite } from './favorite/favorite.entity';
import { Notification } from './notification/notification.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: false,
  ssl: { rejectUnauthorized: false },
  logging: true,
  entities: [User, Meeting, PitchDeck, Offer, Comment, Message, Favorite, Notification],
  migrations: ['dist/migrations/*.js'],
});
