// src/meeting/meeting.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  meeting_date: Date;
}
