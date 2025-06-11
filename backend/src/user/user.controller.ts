import {
  Controller,
  Post,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response as ExpressResponse } from 'express';
import { User } from './user.entity';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Post('register')
  async register(
    @Body() body: {
      email: string;
      password: string;
      name: string;
      role: 'creator' | 'investor';
    }
  ) {
    return this.userService.createUser(
      body.email,
      body.password,
      body.name,
      body.role,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.findByEmail(body.email);

    if (user && await bcrypt.compare(body.password, user.password)) {
      return {
        message: 'Connexion réussie ✅',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }

    return { message: 'Email ou mot de passe invalide ❌' };
  }

  @Post('profil/password')
  async updatePassword(
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() req: Request,
    @Res() res: ExpressResponse,
  ) {
    const sessionUser = req.session?.user;
    if (!sessionUser) return res.status(401).send('Non connecté');

    const user = await this.userRepo.findOneBy({ id: sessionUser.id });
    if (!user) return res.status(404).send('Utilisateur introuvable');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).send('Mot de passe actuel incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    return res.redirect('/profil');
  }
}
