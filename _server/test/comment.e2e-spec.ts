import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { commentContent, createBoard, login, register } from './common';

describe('Comment Module (e2e)', () => {
  let app: INestApplication;

  describe('[POST] /comments', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      const connection = app.get(Connection);
      await connection.synchronize(true);
    });

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
