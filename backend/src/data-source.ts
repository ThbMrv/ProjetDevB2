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
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Utiliser uniquement avec migrations
  logging: true,
  entities: [User, Meeting, PitchDeck, Offer, Comment, Message, Favorite, Notification],
  migrations: ['dist/migrations/*.js'],
});
