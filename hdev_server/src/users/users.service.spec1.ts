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

describe('[Service] UsersService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;
  let boardRepository: BoardRepository;
  let commentRepository: CommentRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BoardsModule,
        CommentsModule,
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Board, Category, View, Tag, Comment],
          synchronize: true,
        }),
        ConfigModule.forRoot(),
      ],
      providers: [
        UsersService,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Board),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {},
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  describe('[프로필조회] UsersSerivce.profile()', () => {
    it('없는 유저의 프로필을 조회할때, 404, user_not_found', async () => {
      // given
      const userId = 'user-id-1';

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
      const userId = 'user-id-1';
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
      const tokenUserId = 'user-id-1';
      const userId = 'user-id-2';
      const updateProfileDto: UpdateProfileDto = {
        nickname: 'nickname',
        introduce: 'introduce',
      };

      // when
      try {
        await usersService.update(tokenUserId, userId, updateProfileDto);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('unauthorized_user');
      }
    });

    it('프로필 수정 성공', async () => {
      // given
      const tokenUserId = 'user-id-1';
      const userId = 'user-id-1';
      const updateProfileDto: UpdateProfileDto = {
        nickname: 'nickname',
        introduce: 'introduce',
      };

      // when
      const updateSpy = jest.spyOn(userRepository, 'update');
      await usersService.update(tokenUserId, userId, updateProfileDto);

      // then
      expect(updateSpy).toBeCalledWith(userId, updateProfileDto);
    });
  });

  describe('[회원탈퇴] UsersService.remove()', () => {
    it('삭제를 요청한 유저와 실제 유저가 다를경우, 401, unauthorized_user', async () => {
      // given
      const tokenUserId = 'user-id-1';
      const userId = 'user-id-2';

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
      const tokenUserId = 'user-id-1';
      const userId = 'user-id-1';

      // when
      const removeSpy = jest.spyOn(userRepository, 'remove');
      await usersService.remove(tokenUserId, userId);

      // then
      expect(removeSpy).toBeCalledWith(userId);
    });
  });

  describe('[활동내역조회] UsersService.history()', () => {
    it('유효하지 않은 활동내역을 요청시', async () => {
      // given
      const userId = 'user-id-1';
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
      const userId = 'user-id-1';
      const item = 'board';
      const board = new Board();

      // when
      jest.spyOn(boardRepository, 'findByUserId').mockResolvedValue([board]);
      const result = await usersService.history(userId, item);

      // then
      expect(result).toEqual([board]);
    });

    it('댓글 작성내역 요청', async () => {
      // given
      const userId = 'user-id-1';
      const item = 'comment';
      const comment = new Comment();

      // when
      jest.spyOn(commentRepository, 'findByUserId').mockResolvedValue([comment]);
      const result = await usersService.history(userId, item);

      // then
      expect(result).toEqual([comment]);
    });
  });
});
