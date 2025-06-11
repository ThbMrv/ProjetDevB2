import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meeting_date: Date;

  @ManyToOne(() => User, (user) => user.meetings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => PitchDeck, (pitchDeck) => pitchDeck.meetings, { onDelete: 'CASCADE' })
  pitchDeck: PitchDeck;
}
