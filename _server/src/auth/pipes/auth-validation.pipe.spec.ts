import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { PipesModule } from './pipes.module';
import { AuthValidationPipe } from './auth-validation.pipe';
import { Type, ArgumentMetadata } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

describe('[Pipe] AuthValidationPipe', () => {
  let pipe: AuthValidationPipe;
  let registerMetadata: ArgumentMetadata;
  let loginMetadata: ArgumentMetadata;

  const email = 'test@test.com';
  const password = 'asdf1234!@';
  const nickname = 'testuser';

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

  it('[회원가입] 유효하지 않은 이메일', async () => {
    const input = new RegisterDto();
    input.email = 'imkdw';
    input.password = password;
    input.nickname = nickname;

    try {
      await pipe.transform(input, registerMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_email');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[회원가입] 유효하지 않은 비밀번호', async () => {
    const input = new RegisterDto();
    input.email = email;
    input.password = 'asdf1234';
    input.nickname = nickname;

    try {
      await pipe.transform(input, registerMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_password');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[회원가입] 유효하지 않은 닉네임', async () => {
    const input = new RegisterDto();
    input.email = email;
    input.password = password;
    input.nickname = 'testuse!';

    try {
      await pipe.transform(input, registerMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_nickname');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[회원가입] 올바른 데이터', async () => {
    const input = new RegisterDto();
    input.email = email;
    input.password = password;
    input.nickname = nickname;

    const result = await pipe.transform(input, registerMetadata);
    expect(result).toEqual(input);
  });
});
