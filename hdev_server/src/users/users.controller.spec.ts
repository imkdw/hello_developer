import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { Board } from 'src/boards/board.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { Category } from 'src/boards/category/category.entity';
import { Tag } from 'src/boards/tag/tag.entity';
import { View } from 'src/boards/view/view.entity';
import { Comment } from 'src/comments/comment.entity';
import { CommentsModule } from 'src/comments/comments.module';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import configuration from 'src/config/configuration';
import { UserRepository } from './user.repository';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ExitUserVerifyDto } from './dto/exit-user-verify.dto';
import { exit } from 'process';

describe('[Controller] UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            profile: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            history: jest.fn(),
            profileImage: jest.fn(),
            password: jest.fn(),
            exitUserVerify: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            profile: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('[프로필조회] UsersController.profile()', () => {
    it('프로필 조회시 유저의 프로필 반환', async () => {
      // given
      const user = new User();
      user.nickname = 'nickname';
      user.introduce = 'introduce';
      user.profileImg = 'profileImg';

      // when
      const profileSpy = jest.spyOn(usersService, 'profile').mockResolvedValue(user);
      const result = await usersController.profile(user.userId);

      // then
      expect(profileSpy).toBeCalledWith(user.userId);
      expect(result).toEqual({
        nickname: 'nickname',
        introduce: 'introduce',
        profileImg: 'profileImg',
      });
    });
  });

  describe('[프로필 수정] UsersController.update()', () => {
    it('프로필 수정시 UsersSerivce.update 호출', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const userId = 'userId';
      const updateProfileDto: UpdateProfileDto = {
        nickname: 'nickname',
        introduce: 'intrudoce',
      };

      // then
      const updateSpy = jest.spyOn(usersService, 'update');
      await usersController.update(req, userId, updateProfileDto);

      // then
      expect(updateSpy).toBeCalledWith(req.user.userId, userId, updateProfileDto);
    });
  });

  describe('[회원탈퇴] UsersController.remove()', () => {
    it('회원탈퇴 요청시 UsersSerivce.remove 호출', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const userId = 'userId';

      // when
      const removeSpy = jest.spyOn(usersService, 'remove');
      await usersController.remove(req, userId);

      // then
      expect(removeSpy).toBeCalledWith(req.user.userId, userId);
    });
  });

  describe('[활동내역 조회] UsersController.history()', () => {
    it('활동내역 조회 요청시 UsersSerivce.history 호출', async () => {
      // given
      const userId = 'userId';

      // when
      const historySpy = jest.spyOn(usersService, 'history');
      await usersController.history(userId, 'board');

      // then
      expect(historySpy).toBeCalledWith(userId, 'board');
    });
  });

  describe('[비밀번호 변경] UsersController.password()', () => {
    it('usersService.password 호출 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const updatePasswordDto: UpdatePasswordDto = {
        password: 'asdf1234!@',
        rePassword: 'asdf1234!@#',
      };
      const userId = 'userId';

      // when
      await usersController.password(req, updatePasswordDto, userId);

      // then
      expect(usersService.password).toBeCalledWith(req.user.userId, userId, updatePasswordDto);
    });
  });

  describe('[유저 인증] UsersController.exitUserVerify()', () => {
    it('usersService.exitUserVerify 호출 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const exitUserVerifyDto: ExitUserVerifyDto = {
        password: 'asdf1234!@',
      };
      const userId = 'userId';

      // when
      await usersController.exitUserVerify(req, exitUserVerifyDto, userId);

      // then
      expect(usersService.exitUserVerify).toBeCalledWith(
        req.user.userId,
        userId,
        exitUserVerifyDto,
      );
    });
  });

  describe('[프로필사진 변경] UsersController.profileImage', () => {
    it('업데이트된 프로필사진이 반환되는지 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const file = {
        originalname: 'test.jpg',
        mimetype: 'image/jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      const userId = 'userId';

      // when
      jest.spyOn(usersService, 'profileImage').mockResolvedValue('imageUrl');
      const result = await usersController.profileImage(req, file, userId);

      // then
      expect(result).toEqual({ profileImg: 'imageUrl' });
    });
  });
});
