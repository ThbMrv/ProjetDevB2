import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { Message } from '../message/message.entity';
import { Favorite } from '../favorite/favorite.entity';

@Entity()
export class PitchDeck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.pitchDecks)
  user: User;

  @Column()
  file: string;

  @Column('float')
  amount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Comment, (comment) => comment.pitchDeck)
  comments: Comment[];

  @OneToMany(() => Message, (message) => message.pitchDeck)
  messages: Message[];

  @OneToMany(() => Favorite, (favorite) => favorite.pitchdeck)
  favorites: Favorite[];

}
