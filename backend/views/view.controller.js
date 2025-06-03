import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class ViewController {
  @Get('/login')
  @Render('login')
  getLoginView() {
    return {};
  }

  @Get('/accueil')
  @Render('accueil')
  getAccueilView(@Req() req: Request) {
    const user = req.session?.user;

    if (!user) {
      return { user: null };
    }

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      isCreator: user.role === 'creator',
    };
  }
}
