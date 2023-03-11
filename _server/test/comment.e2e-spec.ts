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

const commentContent = '댓글입니다';

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
    .send({ title, content, tags, category })
    .set({ Authorization: `Bearer ${accessToken}` })
    .expect(201);

  return response.body.boardId;
}

describe('Comment Module (e2e)', () => {
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

  describe('[POST] /comments', () => {
    it('[댓글작성] 올바른 댓글 작성', async () => {
      await register(app);
      const accessToken = await login(app);
      const boardId = await createBoard(app, accessToken);

      return request(app.getHttpServer())
        .post('/comments')
        .send({ content: commentContent, boardId })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(201)
        .expect({ commentId: 1 });
    });
  });
});
