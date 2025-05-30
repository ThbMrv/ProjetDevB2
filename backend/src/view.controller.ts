import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get('/login')
  @Render('login')
  getLoginView() {
    return {}; // Tu peux passer des variables à la vue si besoin
  }
}
