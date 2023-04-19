import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/user.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../src/boards/board.entity';
import { Category } from '../src/boards/category/category.entity';
import { Tag } from '../src/boards/tag/tag.entity';
import { Recommend } from '../src/boards/recommend/recommend.entity';
import { Comment } from '../src/comments/comment.entity';
import { View } from '../src/boards/view/view.entity';
import { DataSource } from 'typeorm';
import { UtilsService } from '../src/utils/utils.service';
import { account, login, register } from './test.data';
import * as cookieParser from 'cookie-parser';
import { EmailService } from '../src/email/email.service';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let utilsService: UtilsService;
  let userId: string;
  let accessToken: string;
  let refreshToken: string;

  const { email, password, nickname } = account;

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
        AuthModule,
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
          load: [configuration],
        }),
      ],
      providers: [
        UtilsService,
        {
          provide: EmailService,
          useValue: {
            sendVerifyEmail: jest.fn(),
          },
        },
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    utilsService = moduleFixture.get<UtilsService>(UtilsService);

    // 유저 생성 및 ID 저장
    userId = await register(dataSource, utilsService);
    ({ accessToken, refreshToken } = await login(app));
  });

  afterEach(async () => {
    await dataSource.destroy();
    await app.close();
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

    it('유효하지 않은 비밀번호, 400, invalid_password 반환', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: 'asd', nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_password',
        });
    });

    it('유효하지 않은 닉네임, 400, invalid_nickname 반환', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname: 'test!' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_nickname',
        });
    });

    it('중복된 이메일, 400, invalid_email 반환', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'exist_email',
        });
    });

    it('중복된 닉네임, 400, invalid_nickname 반환', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test1@test.com', password, nickname })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'exist_nickname',
        });
    });

    it('유효한 회원가입, 201, userId 반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test1@test.com', password, nickname: 'user1' })
        .expect(201);

      expect(response.body).toHaveProperty('userId');
    });
  });

  describe('[POST] /auth/login - 로그인', () => {
    it('존재하지 않는 이메일, 400, invalid_email_or_password 반환', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test1@test.com', password })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email_or_password',
        });
    });

    it('비밀번호 불일치, 400, invalid_email_or_password 반환', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password: password + 'a' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_email_or_password',
        });
    });

    it('정상 로그인, 200, accessToken, userId, profileImg, nickname 반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password });

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('profileImg');
      expect(response.body).toHaveProperty('nickname');

      const cookies = response.headers['set-cookie'];
      let refreshTokenCookie = cookies.find((cookie: string) => cookie.startsWith('refreshToken='));
      refreshTokenCookie = refreshTokenCookie.split('; ');

      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('Path=/');

      return response;
    });
  });

  describe('[GET] /auth/logout - 로그아웃', () => {
    it('토큰의 유저 아이디와 실제 유저 아이디가 불일치, 401, unauthorized_user 반환', async () => {
      return request(app.getHttpServer())
        .get(`/auth/logout/1`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'unauthorized_user',
        });
    });

    it('정상적인 로그아웃, 204 코드가 반환되고 refreshToken 컬럼이 비어있는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .get(`/auth/logout/${userId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);

      const user = await dataSource.manager.findOne(User, { where: { email } });
      expect(user.refreshToken).toBe('');
      return response;
    });
  });

  describe('[GET] /auth/token - refreshToken으로 accessToken 재발급', () => {
    it('정상적인 토큰 재발급, 200, 엑세스토큰 반환', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/token')
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });
  });

  describe('[GET] /auth/verify/:verifyToken - 이메일 인증시 토큰검증', () => {
    it('정상적인 토큰 검증, 200, user.isVerified가 true로 변경되어야함', async () => {
      let user = await dataSource.manager.findOne(User, { where: { email } });

      await dataSource.manager.update(User, userId, { isVerified: false });
      user = await dataSource.manager.findOne(User, { where: { email } });
      expect(user.isVerified).toBe(false);

      const verifyToken = user.verifyToken;
      const response = await request(app.getHttpServer())
        .get(`/auth/verify/${verifyToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      user = await dataSource.manager.findOne(User, { where: { email } });
      expect(user.isVerified).toBe(true);
      return response;
    });
  });

  describe('[GET] /auth/check/:userId - 사용자 로그인여부 확인', () => {
    it('토큰에 저장된 사용자 아이디와 실제 사용자 아이디가 다를경우, 400, user_mismatch 반환', async () => {
      return request(app.getHttpServer())
        .get(`/auth/check/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'user_mismatch',
        });
    });

    it('로그인이 안된 유저일경우, 401, not_logged_in 반환', async () => {
      await dataSource.manager.update(User, userId, { refreshToken: '' });
      return request(app.getHttpServer())
        .get(`/auth/check/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'not_logged_in',
        });
    });
  });
});
