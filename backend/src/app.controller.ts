import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  userService: any;
  @Get('page')
  renderPage(@Res() res: Response) {
    return res.render('index');
  }
  @Get('login')
  renderConnexion(@Res() res: Response) {
    return res.render('login');
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.userService.create(body); // suppose que tu passes name, email, password, role
  }

}
