import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiCreate = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      description: '새로운 게시글을 생성하고, 생성된 게시글의 ID를 반환',
      schema: {
        type: 'object',
        properties: {
          boardId: { type: 'string' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: `
      게시글 제목이 올바르지 않을경우 - invalid_title
      게시글 내용이 올바르지 않을경우 - invalid_content
      게시글 카테고리가 올바르지 않을경우 - invalid_category
      게시글 태그가 올바르지 않는경우 - invalid_tags`,
      schema: {
        type: 'object',
        properties: {
          statusCode: { example: 400 },
          message: {
            example: 'invalid_title, invalid_content, invalid_category, invalid_tags',
          },
        },
      },
    }),
  );
};

export const ApiFindAll = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '게시글 목록 반환',
      schema: {
        properties: {
          boardId: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          createdAt: { type: 'string' },
          user: {
            properties: {
              userId: { type: 'string' },
              nickname: { type: 'string' },
              profileImg: { type: 'string' },
            },
          },
          view: {
            properties: {
              viewCnt: { type: 'number' },
            },
          },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
              },
            },
          },
          category2: {
            properties: {
              name: { type: 'string' },
            },
          },
        },
      },
    }),
  );
};

export const ApiRecent = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '최근 게시글 목록 반환',
      schema: {
        properties: {
          notice: {
            type: 'array',
            example: [
              {
                boardId: 'string',
                title: 'string',
                createdAt: 'string',
                user: { nickname: 'string', profileImg: 'string' },
                view: { viewCnt: 0 },
              },
            ],
          },
          qna: { type: 'array', example: [] },
          knowledge: { type: 'array', example: [] },
          recruitment: { type: 'array', example: [] },
        },
      },
    }),
  );
};

export const ApiSearch = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '검색결과 게시글 목록 반환',
      schema: {
        type: 'array',
        example: [
          {
            boardId: 'string',
            title: 'string',
            content: 'string',
            createdAt: 'string',
            user: { userId: 'string', nickname: 'string', profileImg: 'string' },
            view: { viewCnt: 0 },
            tags: [{ name: 'string' }],
            category2: { name: 'string' },
          },
        ],
      },
    }),
  );
};

export const ApiDetail = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '게시글 조회 성공시 객체 형식의 상세보기 데이터를 반환',
      schema: {
        properties: {
          boardId: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          createdAt: { type: 'string' },
          recommendCnt: { type: 'number' },
          user: {
            properties: {
              userId: { type: 'string' },
              nickname: { type: 'string' },
              profileImg: { type: 'string' },
            },
          },
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                commentId: { type: 'number' },
                comment: { type: 'string' },
                createdAt: { type: 'string' },
                user: {
                  properties: {
                    userId: { type: 'string' },
                    nickname: { type: 'string' },
                    profileImg: { type: 'string' },
                  },
                },
              },
            },
          },
          view: {
            properties: {
              viewCnt: { type: 'number' },
            },
          },
          tags: {
            type: 'array',
            items: { type: 'object', properties: { name: { type: 'string' } } },
          },
          category1: { properties: { name: { type: 'string' } } },
          category2: { properties: { name: { type: 'string' } } },
          recommends: {
            type: 'array',
            items: { type: 'object', properties: { userId: { type: 'string' } } },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '게시글을 찾을수 없는경우 HTTP 404 - board_not_found',
      schema: {
        properties: {
          statusCode: { example: 404 },
          message: { example: 'board_not_found' },
        },
      },
    }),
  );
};

export const ApiRemove = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiForbiddenResponse({
      description: '삭제를 요청한 유저와 실제 게시글의 유저가 일치하지 않는경우',
      schema: {
        properties: { statusCode: { example: 403 }, message: { example: 'user_mismatch' } },
      },
    }),
    ApiNotFoundResponse({
      description: '삭제를 요청한 게시글을 찾을 수 없는경우',
      schema: {
        properties: { statusCode: { example: 404 }, message: { example: 'board_not_found' } },
      },
    }),
  );
};

export const ApiUpdate = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiNoContentResponse({
      description: '수정에 성공하는 경우 HTTP 204 반환',
    }),
    ApiForbiddenResponse({
      description: '수정을 요청한 유저와 실제 게시글의 유저가 일치하지 않는경우',
      schema: {
        properties: { statusCode: { example: 403 }, message: { example: 'user_mismatch' } },
      },
    }),
  );
};

export const ApiRecommend = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ description: '게시글 추천 추가/삭제 성공시 HTTP 200 반환' }),
  );
};

export const ApiViews = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ description: '게시글 조회수 증가 성공시 HTTP 200 반환' }),
  );
};

export const ApiImageUpload = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '이미지 업로드에 성공하면 imageUrl 반환',
      schema: {
        properties: {
          imageUrl: {
            type: 'string',
          },
        },
      },
    }),
  );
};
