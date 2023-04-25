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
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * [POST] /auth/register - 회원가입
   * 신규 유저가 회원가입시 사용되는 API
   * @param registerDto - 회원가입시 사용되는 유저 입력값
   */
  @ApiOperation({ summary: '회원가입 API' })
  @ApiCreatedResponse({
    description: `회원가입 성공시 201 코드와 생성된 사용자의 아이디 반환`,
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
    },
  })
  @ApiBadRequestResponse({
    description: `
      이메일 형식이 올바르지 않을경우 - invalid_email
      비밀번호 형식이 올바르지 않을경우 - invalid_password
      닉네임 형식이 올바르지 않을경우 - invalid_nickname
      중복된 이메일인 경우 - exist_email
      중복된 닉네임인 경우 - exist_nickname`,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: {
          example: 'invalid_email, invalid_password, invalid_nickname, exist_email, exist_nickname',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '로그인 API' })
  @ApiOkResponse({
    description: `로그인 성공시 200코드와 userId, profileImg, nickname, accessToken을 반환하고 refreshToken 쿠기 설정`,
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        profileImg: { type: 'string' },
        nickname: { type: 'nickname' },
        accessToken: { type: 'string' },
      },
    },
    headers: {
      'Set-Cookie': {
        description: '로그인에 성공하면 설정되는 refreshToken 쿠키',
        schema: {
          example: `refreshToken=jwt.refresh.token httpOnly path=/ secure`,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      '이메일이 존재하지 않거나 비밀번호가 올바르지 않은경우 - invalid_email_or_password',
    schema: {
      type: 'object',
      properties: {
        statusCode: { example: 400 },
        message: { example: 'invalid_email_or_password' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '이메일인증을 수행하지 않은 유저가 로그인을 시도하는 경우 - unauthorized_user',
    schema: {
      type: 'object',
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
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
   * 로그인된 유저를 로그아웃 처리하는 API
   * @param userId - 로그아웃을 요청하는 유저의 아이디
   */
  @ApiOperation({ summary: '로그아웃 API' })
  @ApiOkResponse({
    description: `로그아웃 성공시 200을 반환하고, 데이터베이스에 존재하는 refreshToken을 삭제`,
  })
  @ApiForbiddenResponse({
    description:
      '로그아웃을 요청한 유저와 토큰 내부에 유저가 일치하지 않는경우 - unauthorized_user',
    schema: {
      type: 'object',
      properties: {
        statusCode: { example: 403 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Access Token 재발급 API' })
  @ApiCookieAuth('refreshToken')
  @Get('token')
  @ApiOkResponse({
    description: '정상적인 refreshToken으로 accessToken 재발급 성공시 토큰값 반환',
    schema: { properties: { accessToken: { type: 'string' } } },
  })
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
  @ApiOperation({ summary: '이메일인증 API' })
  @ApiOkResponse({
    description:
      '이메일인증 성공시 HTTP 200을 반환하고, 데이터베이스 유저 정보의 인증여부필드 변경',
  })
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
  @ApiOperation({ summary: '로그인여부 체크 API' })
  @ApiOkResponse({
    description: '로그인여부 체크에 성공시 HTTP 200코드를 반환',
  })
  @ApiBadRequestResponse({
    description: '토큰의 유저와 실제 유저가 일치하지 않는경우 - user_mismatch',
    schema: {
      type: 'object',
      properties: {
        statusCode: { example: 401 },
        message: { example: 'user_mismatch' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '유저의 refreshToken이 서버에 존재하지 않을때 - not_logged_in',
    schema: {
      type: 'object',
      properties: {
        statusCode: { example: 401 },
        message: { example: 'not_logged_in' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('check/:userId')
  async check(@Req() req, @Param('userId') userId: string) {
    await this.authService.check(req.user.userId, userId);
  }
}
