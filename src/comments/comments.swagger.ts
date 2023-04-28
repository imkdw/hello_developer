import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiCreate = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      description: '댓글 작성 성공시 댓글 ID 반환',
      schema: { properties: { commentId: { example: 1 } } },
    }),
  );
};

export const ApiUpdate = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiNoContentResponse({ description: '댓글 수정 성공시' }),
    ApiNotFoundResponse({
      description: '수정할려고 하는 댓글이 없을경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'comment_not_found' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '댓글 수정을 요청한 사용자와 실제 작성자가 다를경우',
      schema: {
        properties: {
          statusCode: { example: 401 },
          message: { example: 'unauthorized_user' },
        },
      },
    }),
  );
};

export const ApiRemove = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiNoContentResponse({ description: '정상적으로 댓글이 삭제된 경우' }),
    ApiNotFoundResponse({
      description: '삭제를 요청한 댓글이 없을경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'comment_not_found' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '삭제를 요청한 유저와 댓글 작성자가 일치하지 않은경우',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'comment_not_found' },
        },
      },
    }),
  );
};
