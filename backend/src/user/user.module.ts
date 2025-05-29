import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';
import { Comment } from '../comment/comment.entity';
import { Message } from '../message/message.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Notification } from '../notification/notification.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PitchDeck,
      Comment,
      Message,
      Favorite,
      Notification,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
