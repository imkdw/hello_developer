import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { UtilsService } from '../src/utils/utils.service';
import { CategoryRepository } from '../src/boards/category/category.repository';
import { AwsService } from '../src/aws/aws.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Board } from '../src/boards/board.entity';
import { Category } from '../src/boards/category/category.entity';
import { Tag } from '../src/boards/tag/tag.entity';
import { Recommend } from '../src/boards/recommend/recommend.entity';
import { Comment } from '../src/comments/comment.entity';
import { View } from '../src/boards/view/view.entity';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { BoardsModule } from '../src/boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import { board, createBoard, createComment, login, login2, register, register2 } from './test.data';
import { account } from './test.data';

describe('Board Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userId: string;
  let user2Id: string;
  let boardId: string;
  let commentId: number;
  let accessToken: string;
  let user2AccessToken: string;
  let utilsService: UtilsService;
  let categoryRepository: CategoryRepository;
  let awsService: AwsService;
  let tempBoardId: string;

  const { title, content, category, tags } = board;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [User, Board, Category, Tag, Recommend, Comment, View],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([Category]),
        BoardsModule,
        AuthModule,
        ConfigModule.forRoot({
          envFilePath: ['.env.test'],
          load: [configuration],
        }),
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
        UtilsService,
        CategoryRepository,
        {
          provide: AwsService,
          useValue: {
            imageUploadToS3: jest.fn(),
            changeFolderName: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    utilsService = moduleFixture.get<UtilsService>(UtilsService);
    categoryRepository = moduleFixture.get<CategoryRepository>(CategoryRepository);
    awsService = moduleFixture.get<AwsService>(AwsService);
    tempBoardId = utilsService.getUUID();

    // 카테고리 데이터 저장
    await categoryRepository.createDefaultCategorys();

    // 유저 생성 및 ID 저장
    userId = await register(dataSource, utilsService);
    user2Id = await register2(dataSource, utilsService);

    accessToken = (await login(app)).accessToken;
    user2AccessToken = (await login2(app)).accessToken;

    // 게시글 작성
    boardId = await createBoard(app, tempBoardId, accessToken);

    // 댓글 작성
    commentId = await createComment(app, accessToken, boardId);
  });

  afterEach(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('[POST] /boards - 게시글 작성', () => {
    it('올바르지 않은 제목, 400, invalid_title', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({ tempBoardId, title: '', content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_title',
        });
    });

    it('올바르지 않은 내용, 400, invalid_content', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({ tempBoardId, title, content: '', category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_content',
        });
    });

    it('올바르지 않은 태그, 400, invalid_tags', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({
          tempBoardId,
          title,
          content,
          category,
          tags: [{ name: 'a' }, { name: 'a' }, { name: 'a' }, { name: 'a' }],
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_tags',
        });
    });

    it('올바르지 않은 카테고리, 400, invalid_category', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({ tempBoardId, title, content, category: 'none', tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_category',
        });
    });

    it('올바른 글 작성, 201, 게시글 아이디를 반환, 조회수 테이블에 데이터가 생성되었는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .post('/boards')
        .send({ tempBoardId, title: '진짜', content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(201);

      const view = await dataSource.manager.findOne(View, { where: { boardId } });
      expect(view.boardId).toBe(boardId);

      // TODO: awsService.changeFolderName 호출하는지 검증필요
      expect(response.body).toHaveProperty('boardId');
    });
  });

  describe('[GET] /boards?category1=&category2= : 특정 카테고리 게시글 가져오기', () => {
    it('존재하지 않는 카테고리로 게시글 목록 조회시, 400, invalid_category', async () => {
      return request(app.getHttpServer())
        .get('/boards?category1=test&category2=')
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_category',
        });
    });

    it('정상적인 카테고리로 게시글 조회시, 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/boards?category1=suggestion&category2=')
        .expect(200);

      const board = response.body[0];
      expect(board.boardId).toBe(boardId);
      expect(board.title).toBe(title);
      expect(board.content).toBe(content);
      expect(board).toHaveProperty('createdAt');
      expect(board.user.userId).toBe(userId);
      expect(board.user.nickname).toBe(account.nickname);
      expect(board.user).toHaveProperty('profileImg');
      expect(board.view).toEqual({ viewCnt: 0 });
      expect(board.tags).toEqual([{ name: 'test' }]);
      expect(board.category2).toBe(null);

      return response;
    });
  });

  describe('[GET] /boards/:boardId - 특정 게시글 가져오기', () => {
    it('존재하지 않는 글 상세보기, 404, board_not_found', async () => {
      return request(app.getHttpServer()).get(`/boards/test`).expect(404).expect({
        statusCode: 404,
        message: 'board_not_found',
      });
    });

    it('정상적인 글 상세보기, 200', async () => {
      const response = await request(app.getHttpServer()).get(`/boards/${boardId}`).expect(200);

      const board = response.body;
      expect(board.boardId).toBe(boardId);
      expect(board.title).toBe(title);
      expect(board.content).toBe(content);
      expect(board).toHaveProperty('createdAt');
      expect(board.recommendCnt).toBe(0);
      expect(board.user.userId).toBe(userId);
      expect(board.user.nickname).toBe(account.nickname);
      expect(board.user).toHaveProperty('profileImg');
      expect(board.comments[0].commentId).toBe(1);
      expect(board.comments[0].comment).toBe('comment');
      expect(board.comments[0]).toHaveProperty('createdAt');
      expect(board.comments[0].user.userId).toBe(userId);
      expect(board.comments[0].user.nickname).toBe(account.nickname);
      expect(board.comments[0].user).toHaveProperty('profileImg');
      expect(response.body.view).toEqual({ viewCnt: 0 });
      expect(response.body.tags).toEqual([{ name: 'test' }]);
      expect(response.body.category1).toEqual({ name: 'suggestion' });
      expect(response.body.category2).toBe(null);
      expect(response.body.recommends).toEqual([]);

      return response;
    });
  });

  describe('[DELETE] /boards/:boardId - 특정 게시글 삭제하기', () => {
    it('글이 없는경우, 404, board_not_found', () => {
      return request(app.getHttpServer())
        .delete(`/boards/test`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'board_not_found',
        });
    });

    it('게시글 작성자와 삭제를 요청한 사용자가 일치하지 않을때, 401, unauthorized_user', () => {
      return request(app.getHttpServer())
        .delete(`/boards/${boardId}`)
        .set({ Authorization: `Bearer ${user2AccessToken}` })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'unauthorized_user',
        });
    });

    it('정상적인 게시글 삭제, 204, DB에 게시글이 존재하지 않는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/boards/${boardId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);

      const board = await dataSource.manager.findOne(Board, { where: { boardId } });
      expect(board).toBe(null);

      return response;
    });
  });

  describe('[PATCH] /boards/:boardId - 게시글 수정하기', () => {
    it('올바르지 않은 제목, 400, invalid_title', () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({ title: '', content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_title',
        });
    });

    it('올바르지 않은 내용, 400, invalid_content', () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({ title, content: '', category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_content',
        });
    });

    it('올바르지 않은 카테고리, 400, invalid_category', async () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({ title, content, category: 'none', tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_category',
        });
    });

    it('올바르지 않은 태그, 400, invalid_tags', async () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({
          title,
          content,
          category,
          tags: [
            { name: 'updateTag1' },
            { name: 'updateTag2' },
            { name: 'updateTag3' },
            { name: 'updateTag4' },
          ],
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_tags',
        });
    });

    it('정상적인 게시글 수정, 204, DB에 반영되었는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({
          title: title + 'a',
          content: content + 'a',
          category: 'free',
          tags: [{ name: 'updateTag' }],
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);

      // TODO: 변경된 태그를 확인하는 테스트코드 추가필요
      const board = await dataSource.manager.findOne(Board, { where: { boardId } });
      expect(board.title).toBe(title + 'a');
      expect(board.content).toBe(content + 'a');
      expect(board.categoryId1).toBe(3);
      return response;
    });
  });

  describe('[GET] /boards/recent - 최근 게시글 가져오기', () => {
    it('정상적인 최근 게시글 가져오기, 200, 공지/지식공유/질답/구인구직 데이터 확인', async () => {
      return request(app.getHttpServer()).get('/boards/recent').expect(200).expect({
        notice: [],
        knowledge: [],
        qna: [],
        recruitment: [],
      });
    });
  });

  describe('[GET] /boards/search?text= - 게시글 검색하기', () => {
    it('결과값이 없는 게시글 검색', async () => {
      return request(app.getHttpServer()).get('/boards/search?text=test').expect(200).expect([]);
    });

    it('결과값이 있는 게시글 검색', async () => {
      const response = await request(app.getHttpServer())
        .get('/boards/search?text=title')
        .expect(200);

      const board = response.body[0];
      expect(board.boardId).toBe(boardId);
      expect(board.title).toBe(title);
      expect(board.content).toBe(content);
      expect(board).toHaveProperty('createdAt');
      expect(board.user.userId).toBe(userId);
      expect(board.user.nickname).toBe(account.nickname);
      expect(board.user).toHaveProperty('profileImg');
      expect(board.view).toEqual({ viewCnt: 0 });
      expect(board.tags).toEqual([{ name: 'test' }]);
      expect(board.category2).toBe(null);
    });
  });

  describe('[GET] /boards/:boardId/recommend', () => {
    it('게시글 추천, 200, 게시글 테이블의 추천수와 추천 테이블에 데이터가 삽입됬는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .get(`/boards/${boardId}/recommend`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const board = await dataSource.manager.findOne(Board, { where: { boardId } });
      expect(board.recommendCnt).toBe(1);

      const recommend = await dataSource.manager.findOne(Recommend, { where: { boardId } });
      expect(recommend.userId).toBe(userId);
      expect(recommend.boardId).toBe(boardId);
      return response;
    });

    it('게시글 추천 취소, 200, 게시글 테이블의 추천수가 감소하고 추천 테이블의 데이터가 지워졌는지 확인', async () => {
      // 추천
      await request(app.getHttpServer())
        .get(`/boards/${boardId}/recommend`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const board = await dataSource.manager.findOne(Board, { where: { boardId } });
      expect(board.recommendCnt).toBe(1);

      const recommend = await dataSource.manager.findOne(Recommend, { where: { boardId } });
      expect(recommend.userId).toBe(userId);
      expect(recommend.boardId).toBe(boardId);

      // 추천 취소
      const response = await request(app.getHttpServer())
        .get(`/boards/${boardId}/recommend`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const afterBoard = await dataSource.manager.findOne(Board, { where: { boardId } });
      expect(afterBoard.recommendCnt).toBe(0);

      const afterRecommend = await dataSource.manager.findOne(Recommend, { where: { boardId } });
      expect(afterRecommend).toBe(null);
    });
  });

  describe('[GET] /boards/:boardId/views - 게시글 조회수 증가', () => {
    it('정상적인 조회수 추가, 실제 데이터베이스에 조회수가 추가되었는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .get(`/boards/${boardId}/views`)
        .expect(200);

      const view = await dataSource.manager.findOne(View, { where: { boardId } });
      expect(view.boardId).toBe(boardId);
      expect(view.viewCnt).toBe(1);
      return response;
    });
  });

  // TODO: 게시글 이미지 업로드 테스트코드 작성필요
});
