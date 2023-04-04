import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './boards.controller';
import { BoardsModule } from './boards.module';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { CategoryRepository } from './category/category.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';
import { TagRepository } from './tag/tag.repository';
import { View } from './view/view.entity';
import { ViewRepository } from './view/view.repository';
import { Recommend } from './recommend/recommend.entity';
import { AwsService } from 'src/aws/aws.service';
import configuration from 'src/config/configuration';
import { UtilsService } from 'src/utils/utils.service';

describe('[Controller] BoardsController', () => {
  let boardsController: BoardsController;
  let boardsService: BoardsService;
  let boardRepository: BoardRepository;
  let categortRepository: CategoryRepository;
  let tagRepository: TagRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Board, Category, View, Tag, Comment, Recommend],
          synchronize: true,
        }),
        BoardsModule,
      ],
      controllers: [BoardsController],
      providers: [
        {
          provide: BoardsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            recent: jest.fn(),
            search: jest.fn(),
            detail: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: BoardRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    boardsController = module.get<BoardsController>(BoardsController);
    boardsService = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
    categortRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  describe('[글작성] BoardsController.create()', () => {
    it('createBoardDto로 boardsService.create가 호출되고 게시글 ID가 반환되는지 확인', async () => {
      // given
      const request = { user: { userId: 'userId' } };
      const newBoard = new CreateBoardDto();
      newBoard.title = 'title';
      newBoard.category = 'qna';
      newBoard.tags = [{ name: 'tags' }];
      newBoard.content = 'content';

      // when
      jest.spyOn(boardsService, 'create').mockResolvedValue('boardId');
      const result = await boardsController.create(request, newBoard);

      // then
      expect(result).toEqual({ boardId: 'boardId' });
    });
  });

  describe('[글목록] BoardsController.findAll()', () => {
    it('qna-tech 카테고리로 조회하고, 게시글 목록 반환', async () => {
      // given
      const category1 = 'qna';
      const category2 = 'tech';

      // when
      jest.spyOn(boardsService, 'findAll').mockResolvedValue([]);
      const result = await boardsController.findAll(category1, category2);

      // then
      expect(result).toEqual([]);
    });
  });

  describe('[최근게시글] BoardsController.recent()', () => {
    it('최근게시글 목록 반환', async () => {
      // given

      // when
      jest.spyOn(boardsService, 'recent').mockResolvedValue({
        notice: [],
        qna: [],
        knowledge: [],
        recruitment: [],
      });
      const result = await boardsController.recent();

      // then
      expect(result).toEqual({
        notice: [],
        qna: [],
        knowledge: [],
        recruitment: [],
      });
    });
  });

  describe('[게시글검색] BoardsController.search()', () => {
    it('검색 게시글 반환', async () => {
      // given
      const text = 'text';

      // when
      jest.spyOn(boardsService, 'search').mockResolvedValue([]);
      const result = await boardsController.search(text);

      // then
      expect(result).toEqual([]);
    });
  });

  describe('[글 상세보기] BoardsController.detail()', () => {
    it('게시글 상세정보 데이터 반환', async () => {
      // given
      const boardId = 'boardId';
      const existBoard = new Board();
      existBoard.boardId = boardId;

      // when
      jest.spyOn(boardsService, 'detail').mockResolvedValueOnce(existBoard);
      const result = await boardsController.detail(boardId);

      // then
      expect(result).toHaveProperty('boardId');
    });
  });

  describe('[글삭제] BoardsController.remove()', () => {
    it('boardsService.remove가 호출되었는지 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const boardId = 'boardId';
      const board = new Board();
      board.userId = 'userId';

      // when
      jest.spyOn(boardRepository, 'findById').mockResolvedValue(board);
      await boardsController.remove(req, boardId);

      // then
      expect(boardsService.remove).toBeCalledWith(req.user.userId, boardId);
    });
  });

  // describe('[글수정] BoardsController.update()', () => {
  //   it('boardsService.update가 호출되었는지 확인', async () => {
  //     // given
  //     const req = { user: { userId: 'userId' } };
  //     const boardId = 'boardId';

  //     const updatedBoard = new UpdateBoardDto();
  //     updatedBoard.title = 'title';
  //     updatedBoard.tags = [{ name: 'tags' }];
  //     updatedBoard.category = 'qna-tech';

  //     const tag = new Tag();
  //     tag.name = 'tags';

  //     // when
  //     const spyUpdate = jest.spyOn(boardsService, 'update');
  //     jest.spyOn(categortRepository, 'findIdByName').mockResolvedValue([2]);
  //     jest.spyOn(tagRepository, 'findByName').mockResolvedValue(tag);
  //     await boardsController.update(req, boardId, updatedBoard);

  //     // then
  //     expect(spyUpdate).toBeCalledWith(req.user.userId, updatedBoard, boardId);
  //   });
  // });
});
