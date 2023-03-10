import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('[POST] /auth/register', () => {
    it('should return 400, invalid email', async () => {
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

    it('should return 400, invalid password', async () => {
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

    it('should return 400, invalid nickname', async () => {
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

    it('should return 400, exist email', async () => {
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

    it('should return 400, exist nickname', async () => {
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

    it('should return 201', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname })
        .expect(201);
    });
  });

  describe('[POST] /auth/login', () => {
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

    it('should return 400, incorrect email', async () => {
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

    it('should return 400, incorrect password', async () => {
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

    it('should return 200 and have accessToken, userId, profileImg, nickname', async () => {
      await register(app);
      return request(app.getHttpServer()).post('/auth/login').send({ email, password }).expect(200);
    });
  });
});
