import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('page')
  renderPage(@Res() res: Response) {
    return res.render('index');
  }
  @Get('login')
  renderConnexion(@Res() res: Response) {
    return res.render('login');
  }

}
