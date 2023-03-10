import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

const email = 'test@test.com';
const password = 'asdf1234!@';
const nickname = 'testuser';

async function register(app: INestApplication) {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, nickname })
    .expect(201);
}

describe('Auth Module (e2e)', () => {
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

  describe('/auth/register', () => {
    it('[POST] 유효하지 않은 이메일, 400, invalid_email', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'testtest.com', password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email',
          error: 'Bad Request',
        });
    });

    it('[POST] 유효하지 않은 비밀번호, 400, invalid_password', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: 'asd', nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_password',
          error: 'Bad Request',
        });
    });

    it('[POST] 유효하지 않은 닉네임, 400, invalid_nickname', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname: 'test!' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_nickname',
          error: 'Bad Request',
        });
    });

    it('[POST] 중복된 이메일, 400, invalid_email', async () => {
      await register(app);
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'exist_email',
          error: 'Bad Request',
        });
    });

    it('[POST] 중복된 닉네임, 400, invalid_nickname', async () => {
      await register(app);
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test1@test.com', password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'exist_nickname',
          error: 'Bad Request',
        });
    });

    it('[POST] 유효한 회원가입, 200', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname })
        .expect(201);
    });
  });

  describe('/auth/login', () => {
    it('should return 400, invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'testtest.com', password })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email_or_password',
          error: 'Bad Request',
        });
    });

    it('[로그인] 없는 이메일, 400, invalid_email_or_password', async () => {
      await register(app);
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test1@test.com', password })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email_or_password',
          error: 'Bad Request',
        });
    });

    it('[로그인] 비밀번호 불일치, 400, invalid_email_or_password', async () => {
      await register(app);
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password: password + 'a' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email_or_password',
          error: 'Bad Request',
        });
    });

    it('[로그인] 정상 로그인, 200, accessToken, userId, profileImg, nickname 반환', async () => {
      await register(app);
      return request(app.getHttpServer()).post('/auth/login').send({ email, password }).expect(200);
    });
  });
});
