import { Body, Controller, Post, UsePipes, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthValidationPipe } from './pipes/auth-validation.pipe';

@Controller('auth')
@UsePipes(AuthValidationPipe)
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

  /**
   * [POST] /auth/login - 로그인 API
   * @param loginDto - 로그인에 필요한 유저 데이터
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const loginData = await this.authService.login(loginDto);
    return { ...loginData };
  }

  /**
   * [GET] /auth/lougout - 로그아웃 API
   * @param id - 로그아웃에 필요한 유저의 아이디
   */
  @Get('logout/:id')
  logout(@Param('id') id: string) {
    // 서버에 캐싱된 데이터에서 유저에 대한 정보 삭제 필요
    return `logout with ${id}'s user`;
  }
}
