import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import { Board } from './board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';
import { View } from './view/view.entity';

describe('[Controller] BoardsController', () => {
  let boardsController: BoardsController;
  let boardsService: BoardsService;

  describe('[글작성] BoardsController.create()', () => {
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
            entities: [Board, User, Category, Comment, View, Tag],
            synchronize: true,
            dropSchema: true,
          }),
        ],
        controllers: [BoardsController],
        providers: [
          BoardsService,
          {
            provide: getRepositoryToken(Board),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Category),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Tag),
            useValue: {},
          },
          {
            provide: getRepositoryToken(View),
            useValue: {},
          },
        ],
      }).compile();

      boardsController = module.get<BoardsController>(BoardsController);
      boardsService = module.get<BoardsService>(BoardsService);
    });

    test('createBoardDto로 boardsService.create()가 호출되고 게시글 ID가 반환', async () => {
      // given
      const request = { user: { userId: 'user-id-1' } };
      const newBoard = new CreateBoardDto();
      newBoard.title = '제목';
      newBoard.category = 'qna';
      newBoard.tags = [{ name: 'test' }];
      newBoard.content = '내용';

      // when
      jest.spyOn(boardsService, 'create').mockResolvedValue('board-id-1');
      const result = await boardsController.create(request, newBoard);

      // then
      expect(boardsService.create).toBeCalledWith(request.user.userId, newBoard);
      expect(result.boardId).toBe('board-id-1');
    });
  });

  describe('[글목록] BoardsController.findAll()', () => {
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
            entities: [Board, User, Category, Comment, View, Tag],
            synchronize: true,
            dropSchema: true,
          }),
        ],
        controllers: [BoardsController],
        providers: [
          BoardsService,
          {
            provide: getRepositoryToken(Board),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Category),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Tag),
            useValue: {},
          },
          {
            provide: getRepositoryToken(View),
            useValue: {},
          },
        ],
      }).compile();

      boardsController = module.get<BoardsController>(BoardsController);
      boardsService = module.get<BoardsService>(BoardsService);
    });

    test('category1, 2로 boardsService.findAll() 호출되고 게시글 목록 반환', async () => {
      // given
      const category1 = 'qna';
      const category2 = 'tech';

      // when
      jest.spyOn(boardsService, 'findAll').mockResolvedValue([]);
      const result = await boardsController.findAll(category1, category2);

      // then
      expect(boardsService.findAll).toBeCalledWith(category1, category2);
      expect(result).toEqual([]);
    });
  });

  describe('[글 상세보기] BoardsController.findOne()', () => {
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
            entities: [Board, User, Category, Comment, View, Tag],
            synchronize: true,
            dropSchema: true,
          }),
        ],
        controllers: [BoardsController],
        providers: [
          BoardsService,
          {
            provide: getRepositoryToken(Board),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Category),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Tag),
            useValue: {},
          },
          {
            provide: getRepositoryToken(View),
            useValue: {},
          },
        ],
      }).compile();

      boardsController = module.get<BoardsController>(BoardsController);
      boardsService = module.get<BoardsService>(BoardsService);
    });

    test('boardId로 boardsService.findOne() 호출되고 게시글 데이터 반환', async () => {
      // given
      const boardId = 'board-id-1';
      const existBoard = new Board();
      existBoard.boardId = boardId;

      // when
      jest.spyOn(boardsService, 'findOne').mockResolvedValueOnce(existBoard);
      const result = await boardsController.findOne(boardId);

      // then
      expect(boardsService.findOne).toBeCalledWith(boardId);
      expect(result.boardId).toEqual(boardId);
    });
  });

  describe('[글삭제] BoardsController.remove()', () => {
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
            entities: [Board, User, Category, Comment, View, Tag],
            synchronize: true,
            dropSchema: true,
          }),
        ],
        controllers: [BoardsController],
        providers: [
          BoardsService,
          {
            provide: getRepositoryToken(Board),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Category),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Tag),
            useValue: {},
          },
          {
            provide: getRepositoryToken(View),
            useValue: {},
          },
        ],
      }).compile();

      boardsController = module.get<BoardsController>(BoardsController);
      boardsService = module.get<BoardsService>(BoardsService);
    });

    test('req, boardId로 boardsService.remove() 호출되었는지 확인', async () => {
      // given
      const req = { user: { userId: 'user-id-1' } };
      const boardId = 'board-id-1';

      // when
      jest.spyOn(boardsService, 'remove').mockResolvedValue(undefined);
      const result = await boardsController.remove(req, boardId);

      // then
      expect(boardsService.remove).toBeCalledWith(req.user.userId, boardId);
      expect(result).toEqual(undefined);
    });
  });

  describe('[글수정] BoardsController.update()', () => {
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
            entities: [Board, User, Category, Comment, View, Tag],
            synchronize: true,
            dropSchema: true,
          }),
        ],
        controllers: [BoardsController],
        providers: [
          BoardsService,
          {
            provide: getRepositoryToken(Board),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Category),
            useValue: {},
          },
          {
            provide: getRepositoryToken(Tag),
            useValue: {},
          },
          {
            provide: getRepositoryToken(View),
            useValue: {},
          },
        ],
      }).compile();

      boardsController = module.get<BoardsController>(BoardsController);
      boardsService = module.get<BoardsService>(BoardsService);
    });

    test('req, updateBoardDto, boardId로 boardsService.update() 호출되었는지 확인', async () => {
      // given
      const req = { user: { userId: 'user-id-1' } };
      const boardId = 'board-id-1';
      const updatedBoard = new UpdateBoardDto();
      updatedBoard.title = 'title';

      // when
      jest.spyOn(boardsService, 'update').mockResolvedValue(undefined);
      const result = await boardsController.update(req, boardId, updatedBoard);

      // then
      expect(boardsService.update).toBeCalledWith(req.user.userId, updatedBoard, boardId);
      expect(result).toEqual(undefined);
    });
  });
});
