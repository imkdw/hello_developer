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

describe('[Controller] UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

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
      controllers: [UsersController],
      providers: [
        UsersService,
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
      const req = { user: { userId: 'user-id-1' } };
      const userId = 'user-id-1';
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
      const req = { user: { userId: 'user-id-1' } };
      const userId = 'user-id-1';

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
      const userId = 'user-id-1';

      // when
      const historySpy = jest.spyOn(usersService, 'history');
      await usersController.history(userId, 'board');

      // then
      expect(historySpy).toBeCalledWith(userId, 'board');
    });
  });
});
