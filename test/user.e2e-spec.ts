import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  account,
  createBoard,
  createComment,
  login,
  login2,
  register,
  register2,
  introduce,
  board,
  createDefaultCategorys,
} from './test.data';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Board } from '../src/boards/board.entity';
import { Category } from '../src/boards/category/category.entity';
import { Tag } from '../src/boards/tag/tag.entity';
import { Recommend } from '../src/boards/recommend/recommend.entity';
import { Comment } from '../src/comments/comment.entity';
import { View } from '../src/boards/view/view.entity';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/http-exception.filter';
import { UtilsService } from '../src/utils/utils.service';
import { CategoryRepository } from '../src/boards/category/category.repository';
import { DataSource } from 'typeorm';
import { AwsService } from '../src/aws/aws.service';

describe('Users Module (e2e)', () => {
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
  let awsService: AwsService;
  let tempBoardId: string;

  const { nickname } = account;

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
        UsersModule,
        AuthModule,
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
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
        {
          provide: AwsService,
          useValue: {
            imageUploadToS3: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    utilsService = moduleFixture.get<UtilsService>(UtilsService);
    categoryRepository = moduleFixture.get<CategoryRepository>(CategoryRepository);
    awsService = moduleFixture.get<AwsService>(AwsService);
    tempBoardId = utilsService.getUUID();

    // 카테고리 데이터 저장
    await createDefaultCategorys(dataSource);

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
    it('수정을 요청한 유저와 실제 유저가 일치하지 않는경우, 403, user_mismatch ', () => {
      return request(app.getHttpServer())
        .patch(`/users/test`)
        .send({ nickname, introduce })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'user_mismatch',
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

    it('정상적인 프로필 수정, 204', async () => {
      const reponse = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ nickname, introduce: 'update-introduce' })
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);

      const user = await dataSource.manager.findOne(User, { where: { userId } });
      expect(user.introduce).toBe('update-introduce');
    });
  });

  describe('[DELETE] /users/:userID - 유저 회원탈퇴', () => {
    it('삭제를 요청한 유저와 실제 유저가 다를경우, 403, user_mismatch', () => {
      return request(app.getHttpServer())
        .delete(`/users/test`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'user_mismatch',
        });
    });

    it('정상적인 회원탈퇴, 204', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .expect(204);

      const user = await dataSource.manager.findOne(User, { where: { userId } });
      expect(user).toBe(null);
      return response;
    });
  });

  describe('[GET] /users/:userId/history?item= - 유저 활동내역 조회하기', () => {
    it('작성한 게시글 조회', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}/history?item=board`)
        .expect(200);

      const { boardId, title, category1, category2 } = response.body[0];

      expect(boardId).toBe(boardId);
      expect(title).toBe(board.title);
      expect(category1).toEqual({ name: 'suggestion' });
      expect(category2).toBe(null);
      expect(response.body[0]).toHaveProperty('createdAt');

      return response;
    });

    it('작성한 댓글 조회', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}/history?item=comment`)
        .expect(200);

      const { boardId, title, category1, category2 } = response.body[0].board;
      const { commentId } = response.body[0];

      expect(commentId).toBe(1);
      expect(boardId).toBe(boardId);
      expect(title).toBe(board.title);
      expect(category1).toEqual({ name: 'suggestion' });
      expect(category2).toBe(null);
      expect(response.body[0].board).toHaveProperty('createdAt');

      return response;
    });
  });

  // TODO: 프로필사진 변경 attach aborted 에러 해결필요
  // describe('[POST] /users/:userId/image - 프로필사진 변경', () => {
  //   it('사진변경을 요청한 유저와 실제 유저가 다를경우, 401, unauthorized_user', async () => {
  //     return request(app.getHttpServer())
  //       .post(`/users/userId/image`)
  //       .set('Authorization', `Bearer ${accessToken}`)
  //       .attach('image', './test.data.ts')
  //       .expect(401)
  //       .expect({
  //         statusCode: 401,
  //         message: 'unauthorized_user',
  //       });
  //   });

  //   it('이미지 업로드를 요청한 유저가 존재하지 않을때, 404, user_not_found', async () => {
  //     await dataSource.manager.delete(User, userId);
  //     const response = await request(app.getHttpServer())
  //       .post(`/users/${userId}/image`)
  //       .set('Authorization', `Bearer ${accessToken}`)
  //       .attach('image', './test.png')
  //       .expect(404)
  //       .expect({
  //         statusCode: 404,
  //         message: 'user_not_found',
  //       });

  //     return response;
  //   });

  //   it('정상적으로 프로플사진 변경, imageUrl 반환, 실제 사용자 프로필이 변경되었는지 확인', async () => {
  //     jest.spyOn(awsService, 'imageUploadToS3').mockResolvedValue('imageUrl');
  //     const response = await request(app.getHttpServer())
  //       .post(`/users/${userId}/image`)
  //       .set('Authorization', `Bearer ${accessToken}`)
  //       .attach('image', './test.png')
  //       .expect(200);

  //     const user = await dataSource.manager.findOne(User, { where: { userId } });
  //     expect(response.body).toEqual({ profileImg: 'imageUrl' });
  //     expect(user.profileImg).toBe('imageUrl');
  //     return response;
  //   });
  // });
  describe('[PATCH] /users/:userId/password - 유저 비밀번호 변경', () => {
    it('변경을 요청한 유저와 실제 유저가 일치하지 않는경우, 403, user_mismatch', async () => {
      return request(app.getHttpServer())
        .patch(`/users/1/password`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password, changePassword: account.password + 'a' })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'user_mismatch',
        });
    });

    it('변경을 요청한 유저를 찾을수 없는경우, 404, user_not_found', async () => {
      await dataSource.manager.delete(User, userId);
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}/password`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password, changePassword: account.password + 'a' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'user_not_found',
        });

      return response;
    });

    it('비밀번호가 일치하지 않는경우, 400, password_mismatch', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/password`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password + 'a', changePassword: account.password + 'a' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'password_mismatch',
        });
    });

    it('정상적으로 비밀번호가 변경됬을 경우, 204, 실제 db의 비밀번호가 변경되었는지 확인', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}/password`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password, changePassword: account.password + 'a' })
        .expect(204);

      const user = await dataSource.manager.findOne(User, { where: { userId } });
      const isCompare = await utilsService.compare(account.password + 'a', user.password);
      expect(isCompare).toBe(true);

      return response;
    });
  });

  describe('[PATCH] /users/:userId/verify - 비밀번호 변경 전 유저 검증 API', () => {
    it('변경을 요청한 유저와 실제 유저가 일치하지 않는경우, 403, user_mismatch', async () => {
      return request(app.getHttpServer())
        .patch(`/users/userId/verify`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'user_mismatch',
        });
    });

    it('인증을 요청한 사용자를 찾을수 없는경우, 404, not_found_user', async () => {
      await dataSource.manager.delete(User, userId);
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}/verify`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'user_not_found',
        });
      return response;
    });

    it('비밀번호가 일치하지 않는경우, 400, password_mismatch', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/verify`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password + 'a' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'password_mismatch',
        });
    });

    it('비밀번호가 일치하는경우, 200', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/verify`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ password: account.password })
        .expect(200);
    });
  });
});
