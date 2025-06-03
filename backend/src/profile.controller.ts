import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { SessionGuard } from './session.guard';

@Controller()
export class ProfileController {
  @UseGuards(SessionGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return {
      message: 'Utilisateur connecté',
      user: req.session.user,
    };
  }

  @UseGuards(SessionGuard)
  @Get('accueil')
  accueil(@Req() req: Request, @Res() res: Response) {
    res.render('accueil', { user: req.session.user });
  }
}
