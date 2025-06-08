import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';
import { Comment } from '../comment/comment.entity';
import { Message } from '../message/message.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Notification } from '../notification/notification.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['creator', 'investor'],
  })
  role: 'creator' | 'investor';

  @OneToMany(() => PitchDeck, (pitchDeck) => pitchDeck.user)
  pitchDecks: PitchDeck[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

}
