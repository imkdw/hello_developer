import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { CustomRequest } from './auth/interfaces/auth.interface';

@Controller()
export class AppController {
  @Get('/')
  ping() {
    return 'health check success';
  }

  @Get('/test')
  test(@Req() req: CustomRequest) {
    if (req.accessToken) {
      console.log('토큰있음');
    } else {
      console.log('토큰없음');
    }
  }
}
