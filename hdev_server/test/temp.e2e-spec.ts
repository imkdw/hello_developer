import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { createBoard, login, register } from './common';

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
      accessToken = await login(app);
      for (let i = 0; i < 100; i++) {
        await createBoard(app, accessToken);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }, 1000000);

    it('임시', async () => {
      expect(1).toBe(1);
    });
  });
});
