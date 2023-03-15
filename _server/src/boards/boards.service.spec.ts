import { BadRequestException } from '@nestjs/common';
import { NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
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

describe('[Service] BoardsService', () => {
  let boardsService: BoardsService;
  let boardRepository: BoardRepository;
  let categoryRepository: CategoryRepository;
  let tagRepository: TagRepository;
  let viewRepository: ViewRepository;

  const title = '게시글 제목';
  const content = '게시글 내용';
  const category = 'qna';
  const tags = [{ name: 'test' }];

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
      ],
      providers: [BoardsService],
    }).compile();

    boardsService = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    tagRepository = module.get<TagRepository>(TagRepository);
    viewRepository = module.get<ViewRepository>(ViewRepository);
  });

  describe('[글작성] BoardsService.create()', () => {
    test('존재하지 않는 카테고리일 경우 400, invalid_category', async () => {
      // given
      const userId = 'user-id-1';
      const createBoardDto: CreateBoardDto = { title, content, category, tags };

      // when
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([null]);
      try {
        await boardsService.create(userId, createBoardDto);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_category');
      }
    });

    test('정상 게시글 생성', async () => {
      // given
      const userId = 'user-id-1';
      const boardId = 'board-id-1';
      const createBoardDto: CreateBoardDto = { title, content, category, tags };

      // when
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([7]);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(boardRepository, 'create').mockResolvedValue(boardId);
      jest.spyOn(viewRepository, 'create').mockResolvedValue(undefined);
      const result = await boardsService.create(userId, createBoardDto);

      // then
      expect(result).toBe(boardId);
    });
  });

  describe('[글목록] BoardsService.findAll()', () => {
    it('이상한 카테고리의 글 조회, 400, invalid_category', async () => {
      // given
      const category1 = 'test';
      const category2 = '';

      // when
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([null]);
      try {
        await boardsService.findAll(category1, category2);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_category');
      }
    });

    it('정상적인 카테고리로 글 조회', async () => {
      // given
      const category1 = 'qna';
      const category2 = 'tech';

      // when
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([7, 8]);
      jest.spyOn(boardRepository, 'findAll').mockResolvedValue([]);
      const result = await boardsService.findAll(category1, category2);

      // then
      expect(result).toEqual([]);
    });
  });

  describe('[글 상세보기] BoardsService.findOne()', () => {
    it('존재하지 않는 글, 404, board_not_found', async () => {
      // given
      const boardId = 'board-id-1';

      // when
      jest.spyOn(boardRepository, 'findOne').mockResolvedValue(false);
      try {
        await boardsService.findOne(boardId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('board_not_found');
      }
    });

    it('존재하는 글은 상세정보 반환', async () => {
      // given
      const boardId = 'board-id-1';
      const board = new Board();

      // when
      jest.spyOn(boardRepository, 'findOne').mockResolvedValue(board);
      const result = await boardsService.findOne(boardId);

      // then
      expect(result).toEqual(board);
    });
  });

  describe('[글삭제] BoardsService.remove()', () => {
    it('존재하지 않는 글 삭제요청시, 404, board_not_found', async () => {
      // given
      const userId = 'user-id-1';
      const boardId = 'board-id-1';

      // when
      jest.spyOn(boardRepository, 'findOne').mockResolvedValue(false);
      try {
        await boardsService.remove(userId, boardId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('board_not_found');
      }
    });

    it('삭제를 요청한 사용자와 글 작성자가 다를경우, 401, unauthorized_user', async () => {
      // given
      const userId = 'user-id-1';
      const boardId = 'board-id-1';
      const user = new User();
      user.userId = 'user-id-2';
      const board = new Board();
      board.user = user;

      // when
      jest.spyOn(boardRepository, 'findOne').mockResolvedValue(board);
      try {
        await boardsService.remove(userId, boardId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('unauthorized_user');
      }
    });

    it('정상적인 게시글 삭제', async () => {
      // given
      const userId = 'user-id-1';

      const boardId = 'board-id-1';
      const user = new User();
      user.userId = 'user-id-1';
      const board = new Board();
      board.user = user;

      // when
      const boardRepoSpy = jest.spyOn(boardRepository, 'remove');
      jest.spyOn(boardRepository, 'findOne').mockResolvedValue(board);
      await boardsService.remove(userId, boardId);

      // then
      expect(boardRepoSpy).toBeCalledWith(userId, boardId);
    });
  });

  describe('[글수정] BoardsService.update()', () => {
    it('이상한 카테고리로 글 수정 요청, 400, invalid_category', async () => {
      // given
      const userId = 'user-id-1';
      const updateBoardDto: UpdateBoardDto = {
        title: '제목',
        content: '내용',
        category: 'qna',
        tags: [{ name: 'test' }],
      };
      const boardId = 'board-id-1';

      // when
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([null]);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(undefined);
      jest.spyOn(tagRepository, 'create');
      jest.spyOn(boardRepository, 'update');
      try {
        await boardsService.update(userId, updateBoardDto, boardId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_category');
      }
    });

    it('정상적인 글 업데이트', async () => {
      // given
      const userId = 'user-id-1';
      const updateBoardDto: UpdateBoardDto = {
        title: '제목',
        content: '내용',
        category: 'qna',
        tags: [{ name: 'test' }],
      };
      const boardId = 'board-id-1';
      const categoryIds = [7];
      const newTag = new Tag();
      newTag.tagId = 1;
      newTag.name = 'test';
      const updatedTags = [newTag];

      // when
      const boardRepoUpdateSpy = jest.spyOn(boardRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([7]);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'create');
      await boardsService.update(userId, updateBoardDto, boardId);

      // then
      expect(boardRepoUpdateSpy).toBeCalledWith(
        userId,
        boardId,
        updateBoardDto,
        categoryIds,
        updatedTags,
      );
    });
  });
});
