import { Controller, Get, Redirect, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  ping() {
    return 'health check success';
  }
}
