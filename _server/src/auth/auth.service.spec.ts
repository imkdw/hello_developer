import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from 'src/password/password.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('[Service] AuthService', () => {
  let authService: AuthService;
  let passwordService: PasswordService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const email = 'test@test.com';
  const password = 'asdf1234!@';
  const nickname = 'testuser';

  beforeAll(async () => {
    const mockRepository = {
      findOne: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        PasswordService,
        JwtService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should register user', async () => {
    // given
    const registerDto: RegisterDto = { email, password, nickname };
    const encryptPassword = 'encryptPassword';

    // when
    jest.spyOn(passwordService, 'encrypt').mockResolvedValue(encryptPassword);
    const registerSpy = jest.spyOn(usersService, 'register').mockResolvedValue(undefined);
    await authService.register(registerDto);

    // then
    expect(registerSpy).toHaveBeenCalledWith({
      email: registerDto.email,
      password: encryptPassword,
      nickname: registerDto.nickname,
    });
  });

  it('should login user and return with access, refresh token', async () => {
    // given
    const loginDto: LoginDto = { email, password };

    const user = new User();
    user.userId = '1';
    user.email = 'test@example.com';
    user.password = 'password';
    user.nickname = 'testuser';
    user.introduce = 'test user';
    user.profileImg = 'https://testuser.img';
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.isVerified = true;
    user.verifyToken = 'token';
    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';

    // when
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
    jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce(accessToken)
      .mockReturnValueOnce(refreshToken);
    const result = await authService.login(loginDto);

    // then
    expect(result).toEqual({
      userId: user.userId,
      profileImg: user.profileImg,
      nickname: user.nickname,
      accessToken,
      refreshToken,
    });
  });

  it('should validate user', async () => {
    // given
    const user = new User();
    user.userId = '1';
    user.email = 'test@example.com';
    user.password = 'password';
    user.nickname = 'testuser';
    user.introduce = 'test user';
    user.profileImg = 'https://testuser.img';
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.isVerified = true;
    user.verifyToken = 'token';

    // when
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
    jest.spyOn(passwordService, 'compare').mockResolvedValue(true);
    const result = await authService.validateUser(email, password);

    // then
    expect(result).toBe(true);
  });
});
