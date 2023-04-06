import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { account } from './test.setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/user.entity';
import { Board } from '../src/boards/board.entity';
import { Category } from '../src/boards/category/category.entity';
import { Tag } from '../src/boards/tag/tag.entity';
import { Recommend } from '../src/boards/recommend/recommend.entity';
import { Comment } from '../src/comments/comment.entity';
import { View } from '../src/boards/view/view.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  const { email, password, nickname } = account;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Board, Category, Tag, Recommend, Comment, View],
          synchronize: true,
        }),
        AuthModule,
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.synchronize(true);
    app.close();
  });

  describe('[POST] /auth/register - 회원가입', () => {
    it('유효하지 않은 이메일, 400, invalid_email', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'testtest.com', password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email',
        });
    });

    it('유효하지 않은 비밀번호, 400, invalid_password', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: 'asd', nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_password',
        });
    });

    it('유효하지 않은 닉네임, 400, invalid_nickname', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname: 'test!' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_nickname',
        });
    });

    it('중복된 이메일, 400, invalid_email', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'exist_email',
        });
    });

    it('중복된 닉네임, 400, invalid_nickname', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test1@test.com', password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'exist_nickname',
        });
    });

    it('유효한 회원가입, 200', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname })
        .expect(201);
    });
  });

  // describe('[POST] /auth/login - 로그인', () => {
  //   it('존재하지 않는 이메일, 400, invalid_email_or_password', async () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email: 'test1@test.com', password })
  //       .expect(400)
  //       .expect({
  //         statusCode: 400,
  //         message: 'invalid_email_or_password',
  //       });
  //   });

  //   it('비밀번호 불일치, 400, invalid_email_or_password', async () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email, password: password + 'a' })
  //       .expect(400)
  //       .expect({
  //         statusCode: 400,
  //         message: 'invalid_email_or_password',
  //       });
  //   });

  //   it('정상 로그인, 200, accessToken, userId, profileImg, nickname 반환', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email, password })
  //       .expect(200);

  //     expect(response.body).toHaveProperty('accessToken');
  //     expect(response.body).toHaveProperty('refreshToken');
  //     expect(response.body).toHaveProperty('userId');
  //     expect(response.body).toHaveProperty('profileImg');
  //     expect(response.body).toHaveProperty('nickname');

  //     return response;
  //   });
  // });
});
