import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Entity()
@Unique(['user', 'pitchdeck'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => PitchDeck, (pitchdeck) => pitchdeck.favorites, { onDelete: 'CASCADE' })
  pitchdeck: PitchDeck;

  @CreateDateColumn()
  createdAt: Date;
}
