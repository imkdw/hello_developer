import { Post, Controller, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthValidationPipe } from './pipes/auth-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * [POST] /auth/register - 회원가입
   * @param registerDto - 회원가입시 사용되는 유저 입력값
   * @returns
   */
  @UsePipes(AuthValidationPipe)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return registerDto;
  }

  /**
   * [POST] /auth/login - 로그인
   * @param loginDto - 로그인시 사용되는 유저의
   * @returns
   */
  @UsePipes(AuthValidationPipe)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return loginDto;
  }
}
