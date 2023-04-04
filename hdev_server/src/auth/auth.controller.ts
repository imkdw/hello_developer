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
   * 신규 유저가 회원가입시 사용되는 API
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
   * 기존 유저가 로그인시 사용되는 API
   * @param loginDto - 로그인시 사용되는 유저의 데이터
   * @returns 토큰 반환
   */
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
    const loginData = await this.authService.login(loginDto);
    const { userId, profileImg, nickname, accessToken, refreshToken } = loginData;

    res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/' });

    return { userId, profileImg, nickname, accessToken };
  }

  /**
   * [GET] /auth/logout/:userId - 로그아웃
   * 로그인된 유저를 로그아웃 처리하는 API
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
   * accessToken 만료시 refreshToken을 활용한 accessToken 재발급 API
   * @returns 엑세스 토큰 반환
   */
  @Get('token')
  async token(@Req() req) {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = this.authService.generateAccessToken(refreshToken);
    return { accessToken };
  }

  /**
   * [GET] /auth/verfiy/:verifyToken - 토큰 검증
   * 회원가입 진행시 이메일 인증을 위한 토큰검증 API
   * @param verifyToken
   */
  @Get('verify/:verifyToken')
  async verify(@Param('verifyToken') verifyToken: string) {
    await this.authService.verify(verifyToken);
  }

  /**
   * [GET] /auth/check/:userId - 사용자 로그인여부 체크
   * 클라이언트에서 localStorage에 저장된 accessToken을 활용한 로그인여부 체크(로그인유지) API
   * @param req
   * @param userId
   */
  @UseGuards(JwtAuthGuard)
  @Get('check/:userId')
  async check(@Req() req, @Param('userId') userId: string) {
    await this.authService.check(req.user.userId, userId);
  }
}
