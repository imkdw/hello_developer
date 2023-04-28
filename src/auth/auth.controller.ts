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
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { Response } from 'express';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiCheck, ApiLogin, ApiLogout, ApiRegister, ApiToken, ApiVerify } from './auth.swagger';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * [POST] /auth/register - 회원가입
   * @param registerDto - 회원가입시 사용되는 유저 입력값
   */
  @ApiRegister('회원가입 API')
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
  @ApiLogin('로그인 API')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
    const loginData = await this.authService.login(loginDto);
    const { userId, profileImg, nickname, accessToken, refreshToken } = loginData;

    res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/', secure: true });

    return { userId, profileImg, nickname, accessToken };
  }

  /**
   * [GET] /auth/logout/:userId - 로그아웃
   * @param userId - 로그아웃을 요청하는 유저의 아이디
   */
  @ApiLogout('로그아웃 API')
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
  @ApiToken('Access Token 재발급 API')
  @Get('token')
  async token(@Req() req) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const accessToken = this.authService.generateAccessToken(refreshToken);
    return { accessToken };
  }

  /**
   * [GET] /auth/verfiy/:verifyToken - 토큰 검증
   * @param verifyToken - 인증용 토큰
   */
  @ApiVerify('이메일인증 API')
  @Get('verify/:verifyToken')
  async verify(@Param('verifyToken') verifyToken: string) {
    await this.authService.verify(verifyToken);
  }

  /**
   * [GET] /auth/check/:userId - 사용자 로그인여부 체크
   * @param req
   * @param userId - 사용자 아이디
   */
  @ApiCheck('로그인여부 체크 API')
  @UseGuards(JwtAuthGuard)
  @Get('check/:userId')
  async check(@Req() req, @Param('userId') userId: string) {
    await this.authService.check(req.user.userId, userId);
  }
}
