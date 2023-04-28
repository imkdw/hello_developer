import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const ApiProfile = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '사용자 정보조회 성공시 유저정보 반환',
      schema: {
        properties: {
          nickname: { type: 'string' },
          introduce: { type: 'string' },
          profileImg: { type: 'string' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '조회하고자 하는 사용자가 존재하지 않을경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'user_not_found' },
        },
      },
    }),
  );
};

export const ApiUpdate = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiNoContentResponse({ description: '사용자 정보 수정 성공시' }),
    ApiForbiddenResponse({
      description: '수정을 요청한 유저와 실제 유저가 일치하지 않는경우',
      schema: {
        properties: { statusCode: { example: 403 }, message: { example: 'user_mismatch' } },
      },
    }),
  );
};

export const ApiRemove = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiNoContentResponse({ description: '회원탈퇴에 성공시' }),
    ApiForbiddenResponse({
      description: '삭제를 요청한 유저와 실제 유저가 일치하지 않는경우',
      schema: {
        properties: { statusCode: { example: 403 }, message: { example: 'user_mismatch' } },
      },
    }),
  );
};

export const ApiHistory = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '회원 활동내역 조회 성공시 활동내역 반환',
      schema: {
        properties: {
          boardOrComment: {
            type: 'array',
            example: [
              {
                boardId: 'string',
                title: 'string',
                createdAt: 'string',
                category1: { name: 'string' },
                category2: { name: 'string' },
              },
            ],
          },
        },
      },
    }),
  );
};

export const ApiProfileImage = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '변경에 성공한 경우 변경된 프로필사진 URL 반환',
      schema: {
        properties: {
          imageUrl: { example: 'string' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '변경을 요청한 사용자와 실제 사용자가 다를경우',
      schema: {
        properties: {
          statusCode: { example: 403 },
          message: { example: 'user_mismatch' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '사용자를 찾을 수 없는경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'user_not_found' },
        },
      },
    }),
  );
};

export const ApiPassword = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiNoContentResponse({ description: '비밀번호 변경 성공시' }),
    ApiNotFoundResponse({
      description: '사용자를 찾을 수 없는경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'user_not_found' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '변경을 요청한 사용자와 실제 사용자가 다를경우',
      schema: {
        properties: {
          statusCode: { example: 403 },
          message: { example: 'user_mismatch' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: '현재 비밀번호가 일치하지 않는 경우',
      schema: {
        properties: {
          statusCode: { example: 400 },
          message: { example: 'password_mismatch' },
        },
      },
    }),
  );
};

export const ApiExitUserVerify = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '비밀번호 검증에 성공한 경우',
    }),
    ApiNotFoundResponse({
      description: '사용자를 찾을 수 없는경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'user_not_found' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '변경을 요청한 사용자와 실제 사용자가 다를경우',
      schema: {
        properties: {
          statusCode: { example: 403 },
          message: { example: 'user_mismatch' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: '현재 비밀번호가 일치하지 않는 경우',
      schema: {
        properties: {
          statusCode: { example: 400 },
          message: { example: 'password_mismatch' },
        },
      },
    }),
  );
};
