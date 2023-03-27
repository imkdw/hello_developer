import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { account, createBoard, createComment, login, register } from './common';

describe('Temp Test (e2e)', () => {
  let app: INestApplication;

  describe('임시', () => {
    let userId: string;
    let accessToken: string;
    let boardId: string;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      userId = await register(app);
    });

    afterEach(async () => {
      // const connection = app.get(Connection);
      // await connection.synchronize(true);
    });

    it('임시', async () => {
      expect(1).toBe(1);
    });
  });
});
