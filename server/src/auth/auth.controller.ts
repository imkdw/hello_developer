import { Body, Controller, Post, Get, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * [POST] /auth/register - 회원가입 API
   * @param registeDto - 회원가입에 필요한 유저 데이터
   */
  @Post('register')
  async register(@Body() registeDto: RegisterDto) {
    await this.authService.register(registeDto);
  }
}
