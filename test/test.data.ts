import { INestApplication } from '@nestjs/common';
import { User } from '../src/users/user.entity';
import { UtilsService } from '../src/utils/utils.service';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { Board } from '../src/boards/board.entity';
import { Tag } from '../src/boards/tag/tag.entity';

export const account = {
  email: 'test@test.com',
  password: 'asdf1234!@',
  nickname: 'testuser',
};
const { email, password, nickname } = account;

export const board = {
  title: 'title',
  content: 'content',
  category: 'suggestion',
  tags: [{ name: 'test' }],
};
const { title, content, category, tags } = board;

export const comment = 'comment';
export const introduce = 'introduce';

export async function register(dataSource: DataSource, utilsService: UtilsService) {
  const user = new User();
  user.email = email;
  user.password = await utilsService.encrypt(password);
  user.nickname = nickname;
  user.verifyToken = utilsService.getUUID();
  user.isVerified = true;

  const createdUser = await dataSource.manager.save(user);

  return createdUser.userId;
}

/** 사용자를 2명 생성하기위한 데이터 */
export async function register2(dataSource: DataSource, utilsService: UtilsService) {
  const user = new User();
  user.email = 'test1@test.com';
  user.password = await utilsService.encrypt(password);
  user.nickname = 'test1';
  user.verifyToken = utilsService.getUUID();
  user.isVerified = true;

  const createdUser = await dataSource.manager.save(user);

  return createdUser.userId;
}

export async function login(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  const cookies = response.headers['set-cookie'];
  let refreshTokenCookie = cookies.find((cookie: string) => cookie.startsWith('refreshToken='));
  const refreshToken = refreshTokenCookie.split('; ')[0].replace('refreshToken=', '');

  return { accessToken: response.body.accessToken, refreshToken };
}

export async function login2(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'test1@test.com', password })
    .expect(200);

  const cookies = response.headers['set-cookie'];
  let refreshTokenCookie = cookies.find((cookie: string) => cookie.startsWith('refreshToken='));
  const refreshToken = refreshTokenCookie.split('; ')[0].replace('refreshToken=', '');

  return { accessToken: response.body.accessToken, refreshToken };
}

export async function createBoard(app: INestApplication, tempBoardId: string, accessToken: string) {
  const response = await request(app.getHttpServer())
    .post('/boards')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ tempBoardId, title, content, category, tags })
    .expect(201);

  return response.body.boardId;
}

export async function createComment(app: INestApplication, accessToken: string, boardId: string) {
  const response = await request(app.getHttpServer())
    .post('/comments')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ boardId, comment })
    .expect(201);

  return response.body.commentId;
}
