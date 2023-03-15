import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { commentContent, createBoard, createComment, login, register } from './common';
import { AppModule } from '../src/app.module';

describe('Comment Module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let boardId: string;
  let commentId: number;

  describe('[POST] /comments', () => {
    describe('[POST] /comments : 댓글 작성', () => {
      beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await register(app);
        accessToken = await login(app);
        boardId = await createBoard(app, accessToken);
      });

      afterEach(async () => {
        const connection = app.get(Connection);
        await connection.synchronize(true);
      });

      it('작성할 댓글 내용이 없을경우, 400, invalid_comment', async () => {
        return request(app.getHttpServer())
          .post('/comments')
          .send({ comment: '', boardId })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'invalid_comment',
          });
      });

      it('정상적인 댓글 작성, 201 ', async () => {
        return request(app.getHttpServer())
          .post('/comments')
          .send({ comment: commentContent, boardId })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(201);
      });
    });

    describe('[PATCH] /comments/:commentId : 댓글 수정', () => {
      beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await register(app);
        accessToken = await login(app);
        boardId = await createBoard(app, accessToken);
        commentId = await createComment(app, boardId, accessToken);
      });

      afterEach(async () => {
        const connection = app.get(Connection);
        await connection.synchronize(true);
      });

      it('수정할 댓글이 없는경우, 404, comment_not_found', () => {
        return request(app.getHttpServer())
          .patch('/comments/999')
          .send({ comment: commentContent })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'comment_not_found',
          });
      });

      it('수정할 댓글 내용이 없을경우, 400, invalid_comment', async () => {
        return request(app.getHttpServer())
          .patch(`/comments/${commentId}`)
          .send({ comment: '' })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'invalid_comment',
          });
      });

      // TODO: 아이디 체크하는 테스트코드 작성필요

      it('정상적인 댓글 수정, 204', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/comments/${commentId}`)
          .send({ comment: commentContent })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(204);
        return response;
      });
    });

    describe('[DELETE] /comments/:commentId : 댓글 삭제', () => {
      beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await register(app);
        accessToken = await login(app);
        boardId = await createBoard(app, accessToken);
        commentId = await createComment(app, boardId, accessToken);
      });

      afterEach(async () => {
        const connection = app.get(Connection);
        await connection.synchronize(true);
      });

      it('삭제할 댓글이 없는경우, 404, comment_not_found', () => {
        return request(app.getHttpServer())
          .delete(`/comments/999`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'comment_not_found',
          });
      });

      // TODO: 아이디 체크하는 테스트코드 작성필요

      it('댓글 정상 삭제, 204', () => {
        return request(app.getHttpServer())
          .delete(`/comments/${commentId}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(204);
      });
    });
  });
});
