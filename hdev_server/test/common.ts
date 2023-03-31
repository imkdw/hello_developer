import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { v4 } from 'uuid';

export const account = {
  email: 'test@test.com',
  password: 'asdf1234!@',
  nickname: 'testuser',
  introduce: 'test introduce',
};

const { email, password, nickname } = account;

export const boardData = {
  title: '테스트 게시글의 제목입니다.',
  category: 'qna-tech',
  content: 'content',
  tags: [{ name: 'nestjs' }],
};

const { title, category, content, tags } = boardData;

export const commentContent = '댓글입니다';

export async function register(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, nickname })
    .expect(201);

  return response.body.userId;
}

export async function login(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return response.body.accessToken;
}

export async function createBoard(app: INestApplication, accessToken: string) {
  const title = '테스트 게시글';

  for (let i = 1; i < 10; i++) {
    await request(app.getHttpServer())
      .post('/boards')
      .send({
        title: '공지사항' + i,
        content,
        tags,
        category: 'notice',
        tempBoardId: 'temp-board-id',
      })
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  for (let i = 1; i < 10; i++) {
    await request(app.getHttpServer())
      .post('/boards')
      .send({
        title: '지식공유' + i,
        content,
        tags,
        category: 'knowledge',
        tempBoardId: 'temp-board-id',
      })
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  for (let i = 1; i < 10; i++) {
    await request(app.getHttpServer())
      .post('/boards')
      .send({ title: '질문답변' + i, content, tags, category: 'qna', tempBoardId: 'temp-board-id' })
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  for (let i = 1; i < 10; i++) {
    await request(app.getHttpServer())
      .post('/boards')
      .send({
        title: '구인구직' + i,
        content,
        tags,
        category: 'recruitment',
        tempBoardId: 'temp-board-id',
      })
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
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
