import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './boards.controller';
import { BoardsModule } from './boards.module';
import { BoardsService } from './boards.service';
import { CategoryRepository } from './category/category.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { TagRepository } from './tag/tag.repository';
import { ViewRepository } from './view/view.repository';
import { Recommend } from './recommend/recommend.entity';
import configuration from 'src/config/configuration';
import { RecommendRepository } from './recommend/recommend.repository';
import { ImageUploadDto } from './dto/image-upload.dto';

describe('[Controller] BoardsController', () => {
  let boardsController: BoardsController;
  let boardsService: BoardsService;
  let boardRepository: BoardRepository;
  let categortRepository: CategoryRepository;
  let tagRepository: TagRepository;
  let recommendRepository: RecommendRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
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
            update: jest.fn(),
            recommend: jest.fn(),
            views: jest.fn(),
            imageUpload: jest.fn(),
          },
        },
        {
          provide: BoardRepository,
          useValue: {
            findById: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TagRepository,
          useValue: {
            findByName: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            findIdByName: jest.fn(),
          },
        },
        {
          provide: ViewRepository,
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: RecommendRepository,
          useValue: {
            findByUserAndBoard: jest.fn(),
          },
        },
      ],
    }).compile();

    boardsController = module.get<BoardsController>(BoardsController);
    boardsService = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
    categortRepository = module.get<CategoryRepository>(CategoryRepository);
    recommendRepository = module.get<RecommendRepository>(RecommendRepository);
    tagRepository = module.get<TagRepository>(TagRepository);
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
      const spyRemove = jest.spyOn(boardsService, 'remove');
      await boardsController.remove(req, boardId);

      // then
      expect(spyRemove).toBeCalledWith(req.user.userId, boardId);
    });
  });

  describe('[글수정] BoardsController.update()', () => {
    it('boardsService.update가 호출되었는지 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const boardId = 'boardId';

      const updatedBoard = new UpdateBoardDto();
      updatedBoard.title = 'title';
      updatedBoard.tags = [{ name: 'tags' }];
      updatedBoard.category = 'qna-tech';

      // when
      const spyServiceUpdate = jest.spyOn(boardsService, 'update');
      jest.spyOn(categortRepository, 'findIdByName').mockResolvedValue([2]);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'create');
      await boardsController.update(req, boardId, updatedBoard);

      // then
      expect(spyServiceUpdate).toBeCalledWith(req.user.userId, updatedBoard, boardId);
    });
  });

  describe('[글 추천] BoardsController.recommend()', () => {
    it('boardService.recommend 호출 확인', async () => {
      // given
      const req = { user: { userId: 'userId' } };
      const boardId = 'boardId';

      const recommend = new Recommend();

      // when
      await boardsController.recommend(req, boardId);
      jest.spyOn(recommendRepository, 'findByUserAndBoard').mockResolvedValue(recommend);

      // then
      expect(boardsService.recommend).toBeCalledWith(req.user.userId, boardId);
    });
  });

  describe('[글 조회수추가] BoardsController.views', () => {
    it('boardService.views 호출 확인', async () => {
      // given
      const boardId = 'boardId';

      // when
      await boardsController.views(boardId);

      // then
      expect(boardsService.views).toBeCalledWith(boardId);
    });
  });

  describe('[게시글 사진 업로드] BoardsController.image()', () => {
    it('사진이 업로드되면 boardsService.imageUpload 호출 확인', async () => {
      // given
      const imageuploadDto: ImageUploadDto = { tempBoardId: 'tempBoardId' };
      const file = {
        originalname: 'test.jpg',
        mimetype: 'image/jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      // when
      await boardsController.imageUpload(file, imageuploadDto);

      // then
      expect(boardsService.imageUpload).toBeCalledWith(file, imageuploadDto);
    });
  });
});
