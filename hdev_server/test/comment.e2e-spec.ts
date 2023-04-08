import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Board } from '../src/boards/board.entity';
import { Category } from '../src/boards/category/category.entity';
import { Tag } from '../src/boards/tag/tag.entity';
import { Recommend } from '../src/boards/recommend/recommend.entity';
import { Comment } from '../src/comments/comment.entity';
import { View } from '../src/boards/view/view.entity';
import { CommentsModule } from '../src/comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import { UtilsService } from '../src/utils/utils.service';
import { createBoard, createComment, login, login2, register, register2 } from './test.data';
import { AuthModule } from '../src/auth/auth.module';
import { CategoryRepository } from '../src/boards/category/category.repository';
import { comment } from './test.data';

describe('Comment Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userId: string;
  let user2Id: string;
  let boardId: string;
  let commentId: number;
  let accessToken: string;
  let user2AccessToken: string;
  let utilsService: UtilsService;
  let categoryRepository: CategoryRepository;
  let tempBoardId: string;

  describe('[POST] /comments', () => {
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
          TypeOrmModule.forFeature([Category]),
          CommentsModule,
          AuthModule,
          ConfigModule.forRoot({
            envFilePath: ['.env.test'],
            load: [configuration],
          }),
        ],
        providers: [
          {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
          },
          UtilsService,
          CategoryRepository,
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      dataSource = moduleFixture.get<DataSource>(DataSource);
      utilsService = moduleFixture.get<UtilsService>(UtilsService);
      categoryRepository = moduleFixture.get<CategoryRepository>(CategoryRepository);
      tempBoardId = utilsService.getUUID();

      // 카테고리 데이터 저장
      await categoryRepository.createDefaultCategorys();

      // 유저 생성 및 ID 저장
      userId = await register(dataSource, utilsService);
      user2Id = await register2(dataSource, utilsService);

      accessToken = (await login(app)).accessToken;
      user2AccessToken = (await login2(app)).accessToken;

      // 게시글 작성
      boardId = await createBoard(app, tempBoardId, accessToken);

      // 댓글 작성
      commentId = await createComment(app, accessToken, boardId);
    });

    afterEach(async () => {
      await dataSource.destroy();
      await app.close();
    });

    describe('[POST] /comments : 댓글 작성', () => {
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
          .send({ comment, boardId })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(201);
      });
    });

    describe('[PATCH] /comments/:commentId : 댓글 수정', () => {
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

      it('수정할 댓글이 없는경우, 404, comment_not_found', () => {
        return request(app.getHttpServer())
          .patch('/comments/999')
          .send({ comment })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'comment_not_found',
          });
      });

      it('수정을 요청한 사용자와 실제 댓글의 작성자가 다를경우, 401, unauthorized_user', async () => {
        return request(app.getHttpServer())
          .patch(`/comments/${commentId}`)
          .send({ comment })
          .set({ Authorization: `Bearer ${user2AccessToken}` })
          .expect(401)
          .expect({
            statusCode: 401,
            message: 'unauthorized_user',
          });
      });

      it('정상적인 댓글 수정, 204, 수정한 댓글내용이 db에 반영됬는지 확인', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/comments/${commentId}`)
          .send({ comment: 'update-comment' })
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(204);

        const comment = await dataSource.manager.findOne(Comment, { where: { commentId } });
        expect(comment.comment).toBe('update-comment');
        return response;
      });
    });

    describe('[DELETE] /comments/:commentId : 댓글 삭제', () => {
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

      it('삭제를 요청한 사용자와 실제 댓글의 작성자가 다를경우, 401, unauthorized_user', () => {
        return request(app.getHttpServer())
          .delete(`/comments/${commentId}`)
          .set({ Authorization: `Bearer ${user2AccessToken}` })
          .expect(401)
          .expect({
            statusCode: 401,
            message: 'unauthorized_user',
          });
      });

      it('댓글 정상 삭제, 204, db에 댓글이 없는지 확인', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/comments/${commentId}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .expect(204);

        const comment = await dataSource.manager.findOne(Comment, { where: { commentId } });
        expect(comment).toBe(null);

        return response;
      });
    });
  });
});
