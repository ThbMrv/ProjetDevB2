import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.userService.createUser(body.email, body.password);
  }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.userService.findByEmail(body.email);

        if (user && await bcrypt.compare(body.password, user.password)) {
            return { message: 'Connexion réussie ✅' };
        }

        return { message: 'Email ou mot de passe invalide ❌' };
    }
}
