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
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { Response } from 'express';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('인증 API')
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
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
    const { userId, profileImg, nickname, accessToken, refreshToken } =
      await this.authService.login(loginDto);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/' });
    return { userId, profileImg, nickname, accessToken };
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
  @Get('token')
  async token(@Req() req) {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = this.authService.createAccessToken(refreshToken);
    return { accessToken };
  }

  @Get('verify/:verifyToken')
  async verify(@Param('verifyToken') verifyToken: string) {
    await this.authService.verify(verifyToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:userId')
  async check(@Req() req, @Param('userId') userId: string) {
    await this.authService.check(req.user.userId, userId);
  }
}
