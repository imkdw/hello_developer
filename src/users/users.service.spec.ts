import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { Board } from 'src/boards/board.entity';
import { BoardRepository } from 'src/boards/board.repository';
import { BoardsModule } from 'src/boards/boards.module';
import { Category } from 'src/boards/category/category.entity';
import { Tag } from 'src/boards/tag/tag.entity';
import { View } from 'src/boards/view/view.entity';
import { Comment } from 'src/comments/comment.entity';
import { CommentRepository } from 'src/comments/comment.repostiroy';
import { CommentsModule } from 'src/comments/comments.module';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import configuration from 'src/config/configuration';
import { UtilsService } from 'src/utils/utils.service';
import { AwsService } from 'src/aws/aws.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ExitUserVerifyDto } from './dto/exit-user-verify.dto';

describe('[Service] UsersService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;
  let boardRepository: BoardRepository;
  let commentRepository: CommentRepository;
  let utilsService: UtilsService;
  let awsService: AwsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            profile: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findById: jest.fn(),
            updatePassword: jest.fn(),
            profileImage: jest.fn(),
          },
        },
        {
          provide: BoardRepository,
          useValue: {
            findHistoryByUserId: jest.fn(),
          },
        },
        {
          provide: CommentRepository,
          useValue: {
            findHistoryByUserId: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            compare: jest.fn(),
            encrypt: jest.fn(),
          },
        },
        {
          provide: AwsService,
          useValue: {
            imageUploadToS3: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    utilsService = module.get<UtilsService>(UtilsService);
    awsService = module.get<AwsService>(AwsService);
  });

  describe('[프로필조회] UsersSerivce.profile()', () => {
    it('없는 유저의 프로필을 조회할때, 404, user_not_found', async () => {
      // given
      const userId = 'userId';

      // when
      jest.spyOn(userRepository, 'profile').mockResolvedValue(null);

      try {
        await usersService.profile(userId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('user_not_found');
      }
    });

    it('프로필 조회 성공', async () => {
      // given
      const userId = 'userId';

      const user = new User();
      user.nickname = 'nickname';
      user.introduce = 'introduce';
      user.profileImg = 'profileImg';

      // when
      jest.spyOn(userRepository, 'profile').mockResolvedValue(user);
      const result = await usersService.profile(userId);

      // then
      expect(result).toEqual(user);
    });
  });

  describe('[프로필수정] UsersService.update()', () => {
    it('수정을 요청한 유저와 실제 유저가 일치하지 않는경우, 401, unauthorized_user', async () => {
      // given
      const tokenUserId = 'userId';

      const user = new User();
      user.userId = 'userId2';

      const updateProfileDto: UpdateProfileDto = {
        nickname: 'nickname',
        introduce: 'introduce',
      };

      // when
      jest.spyOn(userRepository, 'profile').mockResolvedValue(user);
      try {
        await usersService.update(tokenUserId, user.userId, updateProfileDto);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('unauthorized_user');
      }
    });

    it('프로필 수정 성공', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const updateProfileDto: UpdateProfileDto = {
        nickname: 'nickname',
        introduce: 'introduce',
      };

      // when
      await usersService.update(tokenUserId, userId, updateProfileDto);

      // then
      expect(userRepository.update).toBeCalledWith(userId, updateProfileDto);
    });
  });

  describe('[회원탈퇴] UsersService.remove()', () => {
    it('삭제를 요청한 유저와 실제 유저가 다를경우, 401, unauthorized_user', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId2';

      // when
      try {
        await usersService.remove(tokenUserId, userId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('unauthorized_user');
      }
    });

    it('회원탈퇴 성공', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';

      // when
      await usersService.remove(tokenUserId, userId);

      // then
      expect(userRepository.remove).toBeCalledWith(userId);
    });
  });

  describe('[활동내역조회] UsersService.history()', () => {
    it('유효하지 않은 활동내역을 요청시 invalid_item 에러 반환', async () => {
      // given
      const userId = 'userId';
      const item = 'test';

      // when
      try {
        await usersService.history(userId, item);
      } catch (err: any) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_item');
      }
    });

    it('게시글 작성내역 요청', async () => {
      // given
      const userId = 'userId';
      const item = 'board';
      const board = new Board();

      // when
      jest.spyOn(boardRepository, 'findHistoryByUserId').mockResolvedValue([board]);
      const result = await usersService.history(userId, item);

      // then
      expect(result).toEqual([board]);
    });

    it('댓글 작성내역 요청', async () => {
      // given
      const userId = 'userId';
      const item = 'comment';
      const comment = new Comment();

      // when
      jest.spyOn(commentRepository, 'findHistoryByUserId').mockResolvedValue([comment]);
      const result = await usersService.history(userId, item);

      // then
      expect(result).toEqual([comment]);
    });
  });

  describe('[비밀번호 변경] UsersService.password()', () => {
    it('토큰에 포함된 아이디와 실제 요청한 유저의 아이디가 다를경우 unauthorized_user 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId2';
      const updatePasswordDto: UpdatePasswordDto = {
        password: 'asdf1234!@',
        changePassword: 'asdf1234!@',
      };

      // when
      try {
        await usersService.password(tokenUserId, userId, updatePasswordDto);
      } catch (err: any) {
        // then
        expect(err.message).toBe('unauthorized_user');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('변경을 희망하는 유저가 없는경우엔 user_not_found 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const updatePasswordDto: UpdatePasswordDto = {
        password: 'asdf1234!@',
        changePassword: 'asdf1234!@',
      };

      // when
      try {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
        await usersService.password(tokenUserId, userId, updatePasswordDto);
      } catch (err: any) {
        expect(err.message).toBe('user_not_found');
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('비밀번호가 일치하지 않으면 password_mismatch 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const updatePasswordDto: UpdatePasswordDto = {
        password: 'asdf1234!@',
        changePassword: 'asdf1234!@#',
      };
      const user = new User();

      // when
      try {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
        jest.spyOn(utilsService, 'compare').mockResolvedValue(false);
        await usersService.password(tokenUserId, userId, updatePasswordDto);
      } catch (err: any) {
        expect(err.message).toBe('password_mismatch');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('정상적인 비밀번호 변경시 userRepository.updatePassword 호출', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const updatePasswordDto: UpdatePasswordDto = {
        password: 'asdf1234!@',
        changePassword: 'asdf1234!@#',
      };
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      jest.spyOn(utilsService, 'encrypt').mockResolvedValue('hashedPassword');
      await usersService.password(tokenUserId, userId, updatePasswordDto);

      // then
      expect(userRepository.updatePassword).toBeCalledWith(userId, 'hashedPassword');
    });
  });

  describe('[회원탈퇴 유저인증] UsersService.exitUserVerify()', () => {
    it('토큰에 포함된 아이디와 실제 요청한 유저의 아이디가 다를경우 unauthorized_user 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId2';
      const exitUserVerifyDto: ExitUserVerifyDto = {
        password: 'asdf1234!@',
      };

      // when
      try {
        await usersService.exitUserVerify(tokenUserId, userId, exitUserVerifyDto);
      } catch (err: any) {
        // then
        expect(err.message).toBe('unauthorized_user');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('인증을 시도하는 유저가 없는경우엔 user_not_found 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const exitUserVerifyDto: ExitUserVerifyDto = {
        password: 'asdf1234!@',
      };

      // when
      try {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
        await usersService.exitUserVerify(tokenUserId, userId, exitUserVerifyDto);
      } catch (err: any) {
        expect(err.message).toBe('user_not_found');
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('비밀번호가 일치하지 않으면 password_mismatch 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const exitUserVerifyDto: ExitUserVerifyDto = {
        password: 'asdf1234!@',
      };
      const user = new User();

      // when
      try {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
        jest.spyOn(utilsService, 'compare').mockResolvedValue(false);
        await usersService.exitUserVerify(tokenUserId, userId, exitUserVerifyDto);
      } catch (err: any) {
        expect(err.message).toBe('password_mismatch');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('인증 성공시 true 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const exitUserVerifyDto: ExitUserVerifyDto = {
        password: 'asdf1234!@',
      };
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await usersService.exitUserVerify(tokenUserId, userId, exitUserVerifyDto);

      // then
      expect(result).toBe(true);
    });
  });

  describe('[프로필사진 변경] UsersService.exitUserVerify()', () => {
    const file = {
      originalname: 'test.jpg',
      mimetype: 'image/jpg',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    it('토큰에 포함된 아이디와 실제 요청한 유저의 아이디가 다를경우 unauthorized_user 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId2';

      // when
      try {
        await usersService.profileImage(tokenUserId, userId, file);
      } catch (err: any) {
        // then
        expect(err.message).toBe('unauthorized_user');
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('인증을 시도하는 유저가 없는경우엔 user_not_found 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';

      // when
      try {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
        await usersService.profileImage(tokenUserId, userId, file);
      } catch (err: any) {
        expect(err.message).toBe('user_not_found');
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('정상적인 프로필사진 변경시 userRepository.profileImage를 호출하고 imageUrl 반환', async () => {
      // given
      const tokenUserId = 'userId';
      const userId = 'userId';
      const user = new User();

      // when
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(awsService, 'imageUploadToS3').mockResolvedValue('imageUrl');
      const result = await usersService.profileImage(tokenUserId, userId, file);

      // then
      expect(userRepository.profileImage).toBeCalledWith(userId, 'imageUrl');
      expect(result).toBe('imageUrl');
    });
  });
});
