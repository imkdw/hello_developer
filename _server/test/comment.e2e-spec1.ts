import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { commentContent, createBoard, login, register } from './common';
import { AppModule } from '../src/app.module';

describe('Comment Module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let boardId: string;

  describe('[POST] /comments', () => {
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

    it('[댓글작성] 올바른 댓글 작성', async () => {
      return request(app.getHttpServer())
        .post('/comments')
        .send({ content: commentContent, boardId })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(201)
        .expect({ commentId: 1 });
    });
  });
});
