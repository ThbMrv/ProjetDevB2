import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user/user.service';

@Controller('auth')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
    async login(@Req() req: Request, @Res() res: Response, @Body() body: LoginDto) {
    const { email, password } = body;

    const user = await this.userService.validateUser(email, password);
    if (!user) {
        console.log('❌ Tentative échouée - Email ou mot de passe incorrect');
        return res.status(401).json({ message: 'Erreur de connexion ❌' });
    }

    req.session.user = user;

    // 🖨️ Log complet de la session côté terminal
    console.log('✅ Connexion réussie');
    console.log('Session ID :', req.sessionID);
    console.log('Données session :', req.session);

    if (req.headers.accept?.includes('text/html')) {
        return res.redirect('/accueil');
    }

    return res.json({ message: 'Connexion réussie ✅' });
    }


  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}
