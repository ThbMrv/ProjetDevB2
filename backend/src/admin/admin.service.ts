import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PitchDeck) private projectRepo: Repository<PitchDeck>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getAllProjects(): Promise<PitchDeck[]> {
    return this.projectRepo.find();
  }
}
