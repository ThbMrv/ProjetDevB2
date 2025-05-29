import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentFavorites)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFavorites)
  recipient: User;

  @Column({ default: false })
  isRead: boolean;
}
