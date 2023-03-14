import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { LoginDto } from './dto/login.dto';

describe('[Service] AuthService', () => {
  let authService: AuthService;
  let utilsService: UtilsService;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  const email = 'test@test.com';
  const password = 'asdf1234!@';
  const nickname = 'testuser';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UtilsService,
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    utilsService = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('[회원가입] AuthService.register()', () => {
    it('기존에 존재하는 이메일이면 400 반환, exist_email', async () => {
      // given
      const registerDto: RegisterDto = { email, password, nickname };
      const user = new User();
      user.email = email;
      user.password = password;
      user.nickname = nickname;

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(null);

      try {
        await authService.register(registerDto);
      } catch (err: any) {
        // then
        expect(err.message).toEqual('exist_email');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('기존에 존재하는 닉네임이면 400 반환, exist_nickname', async () => {
      // given
      const registerDto: RegisterDto = { email, password, nickname };
      const user = new User();
      user.email = email;
      user.password = password;
      user.nickname = nickname;

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(user);

      try {
        await authService.register(registerDto);
      } catch (err: any) {
        // then
        expect(err.message).toEqual('exist_nickname');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('기존에 존재하지 않는 이메일, 닉네임이면 userRepositry.register 호출 확인', async () => {
      // given
      const registerDto: RegisterDto = { email, password, nickname };
      const user = new User();
      user.email = email;
      user.password = 'encryptPassword';
      user.nickname = nickname;
      user.verifyToken = 'verifyToken';

      // when
      const repositorySpy = jest.spyOn(userRepository, 'register');
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(null);
      jest.spyOn(utilsService, 'getUUID').mockResolvedValue('verifyToken');
      jest.spyOn(utilsService, 'encrypt').mockResolvedValue('encryptPassword');
      await authService.register(registerDto);

      // then
      expect(repositorySpy).toBeCalledWith(user);
    });
  });

  describe('[로그인] AuthService.login()', () => {
    // TODO: 활성화 필요
    // it('로그인은 성공이나 인증되지 않은 유저면 401 반환', async () => {
    //   // given
    //   const loginDto: LoginDto = { email, password };
    //   const user = new User();

    //   // when
    //   jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
    //   try {
    //     await authService.login(loginDto);
    //   } catch (err: any) {
    //     // then
    //     expect(err).toBeInstanceOf(UnauthorizedException);
    //     expect(err.message).toEqual('unauthorized_user');
    //     expect(userRepository.findUserByEmail).toBeCalledWith(loginDto.email);
    //   }
    // });

    it('로그인 성공 및 인증된 유저면 데이터 반환', async () => {
      // given
      const loginDto: LoginDto = { email, password };
      const user = new User();
      user.isVerified = true;

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockResolvedValue('someToken' as never);
      const result = await authService.login(loginDto);

      // then
      expect(userRepository.findUserByEmail).toBeCalledWith(loginDto.email);
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('profileImg');
      expect(result).toHaveProperty('nickname');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('[유저검증] AuthService.validateUser()', () => {
    it('이메일을 사용하는 유저가 없을경우 false', async () => {
      // given

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      const result = await authService.validateUser(email, password);

      // then
      expect(result).toEqual(false);
    });

    it('유저는 있으나 비밀번호가 틀릴경우 false', async () => {
      // given
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(false);
      const result = await authService.validateUser(email, password);

      // then
      expect(result).toEqual(false);
    });

    it('유저 검증에 성공할 경우 true', async () => {
      // given
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await authService.validateUser(email, password);

      // then
      expect(result).toEqual(true);
    });
  });
});
