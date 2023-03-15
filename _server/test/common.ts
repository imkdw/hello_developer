import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const account = {
  email: 'test@test.com',
  password: 'asdf1234!@',
  nickname: 'testuser',
};

const { email, password, nickname } = account;

export const boardData = {
  title: '테스트 게시글의 제목입니다.',
  category: 'qna-tech',
  content: '테스트 게시글의 본문입니다.',
  tags: [{ name: 'nestjs' }],
};

const { title, category, content, tags } = boardData;

export const commentContent = '댓글입니다';

export async function register(app: INestApplication): Promise<void> {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, nickname })
    .expect(201);
}

export async function login(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return response.body.accessToken;
}

export async function createBoard(app: INestApplication, accessToken: string): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/boards')
    .send({ title, content, tags, category })
    .set({ Authorization: `Bearer ${accessToken}` })
    .expect(201);

  return response.body.boardId;
}

export async function createComment(
  app: INestApplication,
  boardId: string,
  accessToken: string,
): Promise<number> {
  const response = await request(app.getHttpServer())
    .post('/comments')
    .send({ boardId, comment: 'comment' })
    .set({ Authorization: `Bearer ${accessToken}` })
    .expect(201);

  return response.body.commentId;
}

export async function getBoard(app: INestApplication, boardId: string) {
  const response = await request(app.getHttpServer()).get(`/boards/${boardId}`).expect(200);

  return response.body;
}
