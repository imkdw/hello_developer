import { Post, Controller, Body, UsePipes, UseGuards, HttpCode } from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * [POST] /auth/register - 회원가입
   * @param registerDto - 회원가입시 사용되는 유저 입력값
   */
  @UsePipes(ValidationPipe)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * [POST] /auth/login - 로그인
   * @param loginDto - 로그인시 사용되는 유저의 데이터
   * @returns 토큰 반환
   */
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
