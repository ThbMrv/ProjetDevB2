
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('Tentative de connexion pour', email);
  
    const user = await this.userService.findByEmail(email);
    if (!user) {
      console.log('❌ Utilisateur introuvable');
      throw new UnauthorizedException('Non autorisé');
    }
  
    if (user.role !== 'admin') {
      console.log('❌ Mauvais rôle:', user.role);
      throw new UnauthorizedException('Non autorisé');
    }
  
    const valid = await bcrypt.compare(pass, user.password);
    console.log('Comparaison mot de passe :', valid);
    if (valid) return user;
  
    throw new UnauthorizedException('Mot de passe invalide');
  }
  
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}