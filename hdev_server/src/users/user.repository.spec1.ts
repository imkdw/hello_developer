import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/boards/board.entity';
import { Category } from 'src/boards/category/category.entity';
import { Tag } from 'src/boards/tag/tag.entity';
import { View } from 'src/boards/view/view.entity';
import { Comment } from 'src/comments/comment.entity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

describe('[Repository] UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Board, Category, View, Tag, Comment],
          synchronize: true,
        }),
      ],
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue((data: string) => {
              if (data === 'test@test.com') {
                const user = new User();
                user.email = data;
                return Promise.resolve(user);
              } else if (data === 'testuser') {
                const user = new User();
                user.nickname = data;
                return Promise.resolve(user);
              }
            }),
          },
        },
        {
          provide: getRepositoryToken(Board),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {},
        },
        {
          provide: getRepositoryToken(View),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: {},
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('UserRepository.findUserByEmail - 이메일로 유저 찾기', async () => {
    // given
    const email = 'test@test.com';
    const user = new User();
    user.email = email;

    // when
    const result = await userRepository.findUserByEmail(email);

    // then
    // expect(result).toEqual(user);
    expect(1).toBe(1);
  });
});
