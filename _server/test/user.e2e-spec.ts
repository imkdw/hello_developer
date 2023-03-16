import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { account, login, register } from './common';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let accessToken: string;
  const { nickname, introduce } = account;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userId = await register(app);
    accessToken = await login(app);
  });

  afterEach(async () => {
    const connection = app.get(Connection);
    await connection.synchronize(true);
  });

  describe('[GET] /users/:userId - 유저 프로필 가져오기', () => {
    it('없는 유저의 프로필 조회, 404, user_not_found', async () => {
      return request(app.getHttpServer()).get(`/users/999`).expect(404).expect({
        statusCode: 404,
        message: 'user_not_found',
      });
    });

    it('정상적인 유저 프로필 가져오기, 200', async () => {
      const response = await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);

      expect(response.body.nickname).toEqual(account.nickname);
      expect(response.body).toHaveProperty('introduce');
      expect(response.body).toHaveProperty('profileImg');
    });
  });

  describe('[PATCH] /users/:userId - 유저 프로필 수정하기', () => {
    it('수정을 요청한 유저와 실제 유저가 일치하지 않는경우, 401, unauthorized_user ', () => {
      return request(app.getHttpServer())
        .patch(`/users/test`)
        .send({ nickname, introduce })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'unauthorized_user',
        });
    });

    it('유효하지 않은 닉네임으로 수정요청, 400, invalid_nickname', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ nickname: '', introduce })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_nickname',
        });
    });

    it('유효하지 않은 자기소개로 수정요청, 400, invalid_introduce', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ nickname, introduce: '111111111111111111111111111111111111111111111111' })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'invalid_introduce',
        });
    });

    it('정상적인 프로필 수정, 204', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ nickname, introduce })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);
    });
  });

  describe('[DELETE] /users/:userID - 유저 회원탈퇴', () => {
    it('삭제를 요청한 유저와 실제 유저가 다를경우, 401, unauthorized_user', () => {
      return request(app.getHttpServer())
        .delete(`/users/test`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'unauthorized_user',
        });
    });

    it('정상적인 회원탈퇴, 204', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);
    });
  });

  describe('[GET] /users/:userId/history?item= - 유저 활동내역 조회하기', () => {
    it('작성한 게시글 조회', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}/history?item=board`)
        .expect(200);
      return response;
    });

    it('작성한 댓글 조회', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}/history?item=comment`)
        .expect(200);
      return response;
    });
  });
});
