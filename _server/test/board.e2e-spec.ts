import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { createBoard, createComment, getBoard, login, register } from './common';

import { boardData } from './common';

describe('Board Module (e2e)', () => {
  let app: INestApplication;
  const { title, content, tags, category } = boardData;
  let accessToken: string;

  describe('[POST] /boards : 게시글 작성', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      await register(app);
      accessToken = await login(app);
    });

    afterAll(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('올바른 글 작성, 200', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(201);
    });

    it('올바르지 않은 인증 토큰, 401, Unauthorized', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category, tags })
        .set({ Authorization: `Bearer asdf` })
        .expect(401);
    });

    it('올바르지 않은 제목, 400, invalid_title', async () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({ title: '', content, category, tags })
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
        .send({ title, content: '', category, tags })
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
        .send({ title, content, category: 'none', tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_category',
        });
    });
  });

  describe('[GET] /boards?category1=&category2= : 특정 카테고리 게시글 가져오기', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('정상적인 목록 가져오기, 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/boards?category1=qna&category2=tech')
        .expect(200);

      return response;
    });
  });

  describe('[GET] /boards/:boardId - 특정 게시글 가져오기', () => {
    let accessToken: string;
    let boardId: string;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      await register(app);
      accessToken = await login(app);
      boardId = await createBoard(app, accessToken);
    });

    afterEach(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('정상적인 글 상세보기, 200', async () => {
      const response = await request(app.getHttpServer()).get(`/boards/${boardId}`).expect(200);
      return response;
    });

    it('존재하지 않는 글 상세보기, 404', async () => {
      const response = await request(app.getHttpServer()).get(`/boards/test`).expect(404).expect({
        statusCode: 404,
        message: 'board_not_found',
      });

      return response;
    });
  });

  describe('[DELETE] /boards/:boardId - 특정 게시글 삭제하기', () => {
    let accessToken: string;
    let boardId: string;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      await register(app);
      accessToken = await login(app);
      boardId = await createBoard(app, accessToken);
    });

    afterAll(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('글이 없는경우', () => {
      return request(app.getHttpServer())
        .delete(`/boards/test`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(404);
    });

    it('글 삭제', () => {
      return request(app.getHttpServer())
        .delete(`/boards/${boardId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);
    });
  });

  describe('[PATCH] /boards/:boardId - 게시글 수정하기', () => {
    let accessToken: string;
    let boardId: string;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      await register(app);
      accessToken = await login(app);
      boardId = await createBoard(app, accessToken);
    });

    afterAll(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('올바르지 않은 제목, 400, invalid_title', async () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({ title: '', content: content + 'a', category, tags: [{ name: 'newTag' }] })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_title',
        });
    });

    it('올바르지 않은 내용, 400, invalid_content', async () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({ title: title + 'a', content: '', category, tags: [{ name: 'newTag' }] })
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
        .send({
          title: title + 'a',
          content: content + 'a',
          category: 'none',
          tags: [{ name: 'newTag' }],
        })
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
          title: title + 'a',
          content: content + 'a',
          category,
          tags: [{ name: 'newTag' }, { name: 'newTag' }, { name: 'newTag' }, { name: 'newTag' }],
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_tags',
        });
    });

    it('정상적인 게시글 수정', async () => {
      await request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .send({ title: title + 'a', content: content + 'a', category, tags: [{ name: 'newTag' }] })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(200);
    });
  });
});
