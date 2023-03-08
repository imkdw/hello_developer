import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { PipesModule } from './pipes.module';
import { AuthValidationPipe } from './validation.pipe';
import { Type, ArgumentMetadata } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

describe('[파이프] AuthValidationPipe', () => {
  let pipe: AuthValidationPipe;
  let registerMetadata: ArgumentMetadata;
  let loginMetadata: ArgumentMetadata;

  const EMAIL = 'test@test.com';
  const PASSWORD = 'asdf1234!@';
  const NICKNAME = 'testuser';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PipesModule],
    }).compile();

    pipe = module.get<AuthValidationPipe>(AuthValidationPipe);

    registerMetadata = {
      type: 'body',
      metatype: RegisterDto,
      data: '',
    };

    loginMetadata = {
      type: 'body',
      metatype: LoginDto,
      data: '',
    };
  });

  it('[회원가입] 유효한 데이터 요청', async () => {
    const input = new RegisterDto();
    input.email = EMAIL;
    input.password = PASSWORD;
    input.nickname = NICKNAME;

    const result = await pipe.transform(input, registerMetadata);
    expect(result).toEqual(input);
  });

  it('[회원가입] 올바르지 않은 이메일 요청', async () => {
    const input = new RegisterDto();
    input.email = 'imkdw';
    input.password = PASSWORD;
    input.nickname = NICKNAME;

    try {
      await pipe.transform(input, registerMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_email');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[회원가입] 올바르지 않은 비밀번호 요청', async () => {
    const input = new RegisterDto();
    input.email = EMAIL;
    input.password = 'asdf1234';
    input.nickname = NICKNAME;

    try {
      await pipe.transform(input, registerMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_password');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[회원가입] 올바르지 않은 닉네임 요청', async () => {
    const input = new RegisterDto();
    input.email = EMAIL;
    input.password = PASSWORD;
    input.nickname = 'testuse!';

    try {
      await pipe.transform(input, registerMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_nickname');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[로그인] 올바르지 않은 이메일 요청', async () => {
    const input = new LoginDto();
    input.email = 'imkdw';
    input.password = PASSWORD;

    try {
      console.log(await pipe.transform(input, loginMetadata));
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_email');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });
});
