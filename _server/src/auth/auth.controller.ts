import {
  Post,
  Controller,
  Body,
  UsePipes,
  UseGuards,
  HttpCode,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
    const userId = await this.authService.register(registerDto);
    return { userId };
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

  /**
   * [GET] /auth/logout/:userId - 로그아웃
   * @param userId - 로그아웃을 요청하는 유저의 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Get('logout/:userId')
  async logout(@Req() req, @Param('userId') userId: string) {
    await this.authService.logout(req.user.userId, userId);
  }

  /**
   * [GET] /auth/token - 엑세스 토큰 재발급
   * @returns 엑세스 토큰 반환
   */
  @UseGuards(JwtAuthGuard)
  @Get('token')
  async token(@Req() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const accessToken = await this.authService.generateAccessToken(req.user.userId, refreshToken);
    return { accessToken };
  }

  @Get('verify/:verifyToken')
  async verify(@Param('verifyToken') verifyToken: string) {
    await this.authService.verify(verifyToken);
  }
}
