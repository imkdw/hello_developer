import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiRegister = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      description: `회원가입 성공시 201 코드와 생성된 사용자의 아이디 반환`,
      schema: {
        type: 'object',
        properties: { userId: { type: 'string' } },
      },
    }),
    ApiBadRequestResponse({
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
            example:
              'invalid_email, invalid_password, invalid_nickname, exist_email, exist_nickname',
          },
        },
      },
    }),
  );
};

export const ApiLogin = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
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
    }),
    ApiBadRequestResponse({
      description:
        '이메일이 존재하지 않거나 비밀번호가 올바르지 않은경우 - invalid_email_or_password',
      schema: {
        type: 'object',
        properties: {
          statusCode: { example: 400 },
          message: { example: 'invalid_email_or_password' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '이메일인증을 수행하지 않은 유저가 로그인을 시도하는 경우 - unauthorized_user',
      schema: {
        type: 'object',
        properties: {
          statusCode: { example: 401 },
          message: { example: 'unauthorized_user' },
        },
      },
    }),
  );
};

export const ApiLogout = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: `로그아웃 성공시 200을 반환하고, 데이터베이스에 존재하는 refreshToken을 삭제`,
    }),
    ApiForbiddenResponse({
      description:
        '로그아웃을 요청한 유저와 토큰 내부에 유저가 일치하지 않는경우 - unauthorized_user',
      schema: {
        type: 'object',
        properties: {
          statusCode: { example: 403 },
          message: { example: 'unauthorized_user' },
        },
      },
    }),
  );
};

export const ApiToken = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCookieAuth('refreshToken'),
    ApiOkResponse({
      description: '정상적인 refreshToken으로 accessToken 재발급 성공시 토큰값 반환',
      schema: { properties: { accessToken: { type: 'string' } } },
    }),
    ApiForbiddenResponse({
      description: 'refresh token 쿠키가 전달되지 않은 경우',
      schema: {
        properties: {
          statusCode: { example: 403 },
          message: { example: 'forbidden' },
        },
      },
    }),
  );
};

export const ApiVerify = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description:
        '이메일인증 성공시 HTTP 200을 반환하고, 데이터베이스 유저 정보의 인증여부필드 변경',
    }),
  );
};

export const ApiCheck = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '로그인여부 체크에 성공시 HTTP 200코드를 반환',
    }),
    ApiBadRequestResponse({
      description: '토큰의 유저와 실제 유저가 일치하지 않는경우 - user_mismatch',
      schema: {
        type: 'object',
        properties: {
          statusCode: { example: 401 },
          message: { example: 'user_mismatch' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '유저의 refreshToken이 서버에 존재하지 않을때 - not_logged_in',
      schema: {
        type: 'object',
        properties: {
          statusCode: { example: 401 },
          message: { example: 'not_logged_in' },
        },
      },
    }),
  );
};
