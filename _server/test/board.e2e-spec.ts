import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

const email = 'test@test.com';
const password = 'asdf1234!@';
const nickname = 'testuser';

const title = '테스트 게시글의 제목입니다.';
const category = 'qna-tech';
const content = '테스트 게시글의 본문입니다.';
const tags = [{ name: 'nestjs' }];

async function register(app: INestApplication) {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, nickname })
    .expect(201);
}

async function login(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return response.body.accessToken;
}

async function createBoard(app: INestApplication, accessToken: string) {
  const response = await request(app.getHttpServer())
    .post('/boards')
    .send({ title, content, category, tags })
    .set({ Authorization: `Bearer ${accessToken}` })
    .expect(201);

  return response.body.boardId;
}

async function createComment(app: INestApplication, boardId: string, accessToken: string) {
  const response = await request(app.getHttpServer())
    .post('/comments')
    .send({ boardId, content: 'comment' })
    .set({ Authorization: `Bearer ${accessToken}` })
    .expect(201);

  return response.body.commentId;
}

describe('Board Module (e2e)', () => {
  let app: INestApplication;

  describe('[POST] /boards', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('[글작성] 올바른 글 작성', async () => {
      await register(app);
      const accessToken = await login(app);

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(201);
    });

    it('[글작성] 올바르지 않은 인증 토큰, 401, Unauthorized', async () => {
      await register(app);

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category, tags })
        .set({ Authorization: `Bearer asdf` })
        .expect(401);
    });

    it('[글작성] 올바르지 않은 제목, 400, invalid_title', async () => {
      await register(app);
      const accessToken = await login(app);

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title: '', content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_title',
          error: 'Bad Request',
        });
    });

    it('[글작성] 올바르지 않은 내용, 400, invalid_content', async () => {
      await register(app);
      const accessToken = await login(app);

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content: '', category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_content',
          error: 'Bad Request',
        });
    });

    it('[글작성] 올바르지 않은 태그, 400, invalid_tags', async () => {
      await register(app);
      const accessToken = await login(app);

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
          error: 'Bad Request',
        });
    });

    it('[글작성] 올바르지 않은 카테고리, 400, invalid_title', async () => {
      await register(app);
      const accessToken = await login(app);

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category: 'none', tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_category',
          error: 'Bad Request',
        });
    });
  });

  describe('[GET] /boards?category1=&category2=', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('[글목록] 정상적인 목록 가져오기', async () => {
      await register(app);
      const accessToken = await login(app);
      const boardId = await createBoard(app, accessToken);
      const commentId = await createComment(app, boardId, accessToken);

      const response = await request(app.getHttpServer())
        .get('/boards?category1=qna&category2=tech')
        .expect(200);
      console.log(response.body);
      return response;
    });
  });

  describe('[GET] /boards/:boardId', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

    it('[상세보기] 정상적인 글 상세보기', async () => {
      await register(app);
      const accessToken = await login(app);
      const boardId = await createBoard(app, accessToken);
      const commentId = await createComment(app, boardId, accessToken);

      const response = await request(app.getHttpServer()).get(`/boards/${boardId}`).expect(200);

      console.dir(response.body, { colors: false, depth: 10 });
      return response;
    });
  });
});
