import { INestApplication } from '@nestjs/common';
import { User } from '../src/users/user.entity';
import { UtilsService } from '../src/utils/utils.service';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

export const account = {
  email: 'test@test.com',
  password: 'asdf1234!@',
  nickname: 'testuser',
};

const { email, password, nickname } = account;

export async function register(
  dataSource: DataSource,
  utilsService: UtilsService,
): Promise<string> {
  const newUser = new User();
  newUser.email = email;
  newUser.password = await utilsService.encrypt(password);
  newUser.nickname = nickname;
  newUser.verifyToken = 'verfiyToken';
  newUser.isVerified = true;
  const createdUser = await dataSource.manager.save(newUser);

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
