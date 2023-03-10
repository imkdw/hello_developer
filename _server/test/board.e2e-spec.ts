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

  return response.body;
}

describe('Board Module (e2e)', () => {
  let app: INestApplication;

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

  describe('[POST] /boards', () => {
    it('[글작성] 올바른 글 작성', async () => {
      await register(app);
      const data = await login(app);
      const { accessToken } = data;

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category, tags })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(201);
    });

    it('[글작성] 올바르지 않은 인증 토큰, 401, Unauthorized', async () => {
      await register(app);
      const data = await login(app);

      return request(app.getHttpServer())
        .post('/boards')
        .send({ title, content, category, tags })
        .set({ Authorization: `Bearer asdf` })
        .expect(401);
    });

    it('[글작성] 올바르지 않은 제목, 400, invalid_title', async () => {
      await register(app);
      const data = await login(app);
      const { accessToken } = data;

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
      const data = await login(app);
      const { accessToken } = data;

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
      const data = await login(app);
      const { accessToken } = data;

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
      const data = await login(app);
      const { accessToken } = data;

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
});
