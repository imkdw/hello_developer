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

describe('[Controller] BoardsController', () => {
  let boardsController: BoardsController;
  let boardsService: BoardsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Board, Category, View, Tag, Comment],
          synchronize: true,
        }),
        BoardsModule,
        ConfigModule.forRoot(),
      ],
      controllers: [BoardsController],
      providers: [BoardsService],
    }).compile();

    boardsController = module.get<BoardsController>(BoardsController);
    boardsService = module.get<BoardsService>(BoardsService);
  });

  describe('[글작성] BoardsController.create()', () => {
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
      expect(result).toHaveProperty('boardId');
    });
  });

  describe('[글삭제] BoardsController.remove()', () => {
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
