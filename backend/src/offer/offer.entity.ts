import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => PitchDeck, (pitch) => pitch.id)
  pitchDeck: PitchDeck;

  @Column('float')
  amount: number;
}
