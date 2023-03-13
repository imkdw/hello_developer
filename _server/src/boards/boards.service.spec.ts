import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { Tag } from './tag/tag.entity';
import { View } from './view/view.entity';

describe('[Service] BoardService', () => {
  let boardsService: BoardsService;

  describe('[글작성] BoardsService.create()', () => {
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1234',
            database: 'hello_developer_migration',
            entities: [User, Board, Category, View, Tag, Comment],
            synchronize: true,
            dropSchema: true,
          }),
        ],
        providers: [
          BoardsService,
          {
            provide: getRepositoryToken(Board),
            useValue: {
              save: jest.fn(() => {
                return { boardId: 'board-id-1' };
              }),
            },
          },
          {
            provide: getRepositoryToken(Category),
            useValue: {
              findOne: jest.fn(),
            },
          },
          {
            provide: getRepositoryToken(Tag),
            useValue: {
              fineOne: jest.fn(),
            },
          },
          {
            provide: getRepositoryToken(View),
            useValue: {
              save: jest.fn(),
            },
          },
        ],
      }).compile();

      boardsService = module.get<BoardsService>(BoardsService);
    });

    it('test', () => {
      expect(1).toBe(1);
    });
    // it('존재하지 않는 카테고리로 게시글 작성요청', async () => {
    //   // given
    //   const createBoardDto: CreateBoardDto = {
    //     title: 'title',
    //     content: 'content',
    //     category: 'test',
    //     tags: [{ name: 'tag' }],
    //   };
    //   const user = new User();

    //   try {
    //     await boardsService.create(user.userId, createBoardDto);
    //   } catch (err: any) {
    //     expect(err).toBeInstanceOf(BadRequestException);
    //   }
    // });

    // it('정상적인 글작성', async () => {
    //   // given
    //   const createBoardDto: CreateBoardDto = {
    //     title: 'title',
    //     content: 'content',
    //     category: 'qna',
    //     tags: [{ name: 'tag' }],
    //   };
    //   const user = new User();

    //   // when
    //   jest.spyOn(boardsService, 'findCategoryIdByName').mockResolvedValue([7]);
    //   jest.spyOn(boardsService, 'findTagByName').mockReturnValue(null);

    //   // then
    //   const result = await boardsService.create(user.userId, createBoardDto);
    //   expect(result).toEqual('board-id-1');
    // });
  });
});
