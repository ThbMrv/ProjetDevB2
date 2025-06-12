import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { Message } from '../message/message.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Offer } from '../offer/offer.entity';

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

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'en cours' })
  status: string;

  @Column({ nullable: true })
  pdfUrl: string;

  @ManyToOne(() => Offer, { nullable: true })
  @JoinColumn({ name: 'acceptedOfferId' })
  acceptedOffer: Offer;

  meetings: any;
}
