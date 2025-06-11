import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response as ExpressResponse } from 'express';
import { User } from './user.entity';

@Controller('auth')
export class UserController {
  pitchdeckRepo: any;
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

  @Post('/admin/users/:id/delete')
async deleteUser(@Param('id') id: number, @Req() req: Request) {
  const user = req.session?.user;
  if (!user || user.role !== 'admin') throw new UnauthorizedException();
  await this.userRepo.delete(id);
  return { success: true };
}

@Post('/admin/projects/:id/delete')
async deleteProject(@Param('id') id: number, @Req() req: Request) {
  const user = req.session?.user;
  if (!user || user.role !== 'admin') throw new UnauthorizedException();
  await this.pitchdeckRepo.delete(id);
  return { success: true };
}

@Post('/admin/projects/:id/edit')
async editProject(
  @Param('id') id: number,
  @Body('file') file: string,
  @Body('status') status: string,
  @Req() req: Request
) {
  const user = req.session?.user;
  if (!user || user.role !== 'admin') throw new UnauthorizedException();

  await this.pitchdeckRepo.update(id, { file, status });
  return { success: true };
}

}
