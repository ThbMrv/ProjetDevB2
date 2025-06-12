import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse<Response>();

    if (err || !user) {
      return res.redirect('/login?error=1');
    }

    return user;
  }
}
