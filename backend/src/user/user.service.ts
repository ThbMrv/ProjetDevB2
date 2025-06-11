import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const cleanEmail = email.trim().toLowerCase();
    console.log('[Recherche par email] →', cleanEmail);
    const user = await this.userRepo.findOne({ where: { email: cleanEmail } });
    return user ?? undefined;
  }
  
  



  async createUser(email: string, password: string, name: string, role: 'creator' | 'investor') {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    return this.userRepo.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  // Removed duplicate implementation of findByEmail
  
}
