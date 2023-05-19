import { BadRequestException } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsService } from './boards.service';
import { CategoryRepository } from './category/category.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';
import { TagRepository } from './tag/tag.repository';
import { ViewRepository } from './view/view.repository';
import configuration from 'src/config/configuration';
import { RecommendRepository } from './recommend/recommend.repository';
import { UtilsService } from 'src/utils/utils.service';
import { AwsService } from 'src/aws/aws.service';
import { Recommend } from './recommend/recommend.entity';
import { ImageUploadDto } from './dto/image-upload.dto';
import { DataSource } from 'typeorm';

describe('[Service] BoardsService', () => {
  let boardsService: BoardsService;
  let boardRepository: BoardRepository;
  let categoryRepository: CategoryRepository;
  let tagRepository: TagRepository;
  let viewRepository: ViewRepository;
  let utilsService: UtilsService;
  let recommendRepository: RecommendRepository;
  let awsService: AwsService;
  let dataSource: DataSource;

  const tempBoardId = 'tempBoardId';
  const title = '게시글 제목';
  const content = '게시글 내용';
  const category = 'qna';
  const tags = [{ name: 'test' }];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        BoardsService,
        {
          provide: BoardRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            detail: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
            removeRecommend: jest.fn(),
            addRecommend: jest.fn(),
            recent: jest.fn(),
            search: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            findIdByName: jest.fn(),
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
          provide: ViewRepository,
          useValue: {
            create: jest.fn(),
            add: jest.fn(),
          },
        },
        {
          provide: RecommendRepository,
          useValue: {
            findByUserAndBoard: jest.fn(),
            removeRecommend: jest.fn(),
            addRecommend: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            getUUID: jest.fn(),
          },
        },
        {
          provide: AwsService,
          useValue: {
            changeFolderName: jest.fn(),
            imageUploadToS3: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    boardsService = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    tagRepository = module.get<TagRepository>(TagRepository);
    viewRepository = module.get<ViewRepository>(ViewRepository);
    utilsService = module.get<UtilsService>(UtilsService);
    recommendRepository = module.get<RecommendRepository>(RecommendRepository);
    awsService = module.get<AwsService>(AwsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('[글작성] BoardsService.create()', () => {
    test('존재하지 않는 카테고리일 경우 400, invalid_category', async () => {
      const userId = 'userId';
      const createBoardDto: CreateBoardDto = { tempBoardId, title, content, category, tags };
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([null]);
      try {
        await boardsService.create(userId, createBoardDto);
      } catch (err: any) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_category');
      }
    });

    test('정상 게시글 생성', async () => {
      const userId = 'userId';
      const createBoardDto: CreateBoardDto = { tempBoardId, title, content, category, tags };
      const tag = new Tag();
      tag.name = 'test';
      const newBoard = new Board();
      newBoard.boardId = 'uuid';
      newBoard.categoryId1 = 2;
      newBoard.categoryId2 = null;
      newBoard.content = content;
      newBoard.tempBoardId = 'tempBoardId';
      newBoard.title = title;
      newBoard.userId = userId;
      newBoard.tags = [tag];

      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([2]);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(null);
      const spyBoardRepoCreate = jest.spyOn(boardRepository, 'create');
      const spyViewRepoCreate = jest.spyOn(viewRepository, 'create');
      jest.spyOn(utilsService, 'getUUID').mockReturnValue('uuid');
      const result = await boardsService.create(userId, createBoardDto);

      expect(spyBoardRepoCreate).toBeCalledWith(dataSource.createQueryRunner(), newBoard);
      expect(spyViewRepoCreate).toBeCalledWith(dataSource.createQueryRunner(), 'uuid');
      expect(result).toBe('uuid');
    });
  });

  describe('[글목록] BoardsService.findAll()', () => {
    it('이상한 카테고리의 글 조회, 400, invalid_category', async () => {
      const category1 = 'test';
      const category2 = '';

      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([null]);
      try {
        await boardsService.findAll(category1, category2);
      } catch (err: any) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_category');
      }
    });

    it('정상적인 카테고리로 글 조회', async () => {
      const category1 = 'qna';
      const category2 = 'tech';

      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([7, 8]);
      jest.spyOn(boardRepository, 'findAll').mockResolvedValue([]);
      const result = await boardsService.findAll(category1, category2);

      expect(result).toEqual([]);
    });
  });

  describe('[글 상세보기] BoardsService.detail()', () => {
    it('존재하지 않는 글, 404, board_not_found', async () => {
      const boardId = 'boardId';

      jest.spyOn(boardRepository, 'detail').mockResolvedValue(false);
      try {
        await boardsService.detail(boardId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('board_not_found');
      }
    });

    it('존재하는 글은 상세정보 반환', async () => {
      const boardId = 'boardId';
      const board = new Board();

      jest.spyOn(boardRepository, 'detail').mockResolvedValue(board);
      const result = await boardsService.detail(boardId);

      expect(result).toEqual(board);
    });
  });

  describe('[글삭제] BoardsService.remove()', () => {
    it('존재하지 않는 글 삭제요청시, 404, board_not_found', async () => {
      const userId = 'userId';
      const boardId = 'boardId';

      jest.spyOn(boardRepository, 'findById').mockResolvedValue(null);
      try {
        await boardsService.remove(userId, boardId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('board_not_found');
      }
    });

    it('삭제를 요청한 사용자와 글 작성자가 다를경우, 403, user_mismatch', async () => {
      const userId = 'userId';
      const boardId = 'boardId';

      const board = new Board();
      board.userId = 'userId2';

      jest.spyOn(boardRepository, 'findById').mockResolvedValue(board);
      try {
        await boardsService.remove(userId, boardId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('user_mismatch');
      }
    });

    it('정상적인 게시글 삭제', async () => {
      const userId = 'userId';
      const boardId = 'boardId';

      const board = new Board();
      board.userId = userId;

      const boardRepoSpy = jest.spyOn(boardRepository, 'remove');
      jest.spyOn(boardRepository, 'findById').mockResolvedValue(board);
      await boardsService.remove(userId, boardId);

      expect(boardRepoSpy).toBeCalledWith(userId, boardId);
    });
  });

  describe('[글수정] BoardsService.update()', () => {
    it('이상한 카테고리로 글 수정 요청, 400, invalid_category', async () => {
      const userId = 'userId';
      const existBoard = new Board();
      existBoard.userId = userId;

      const updateBoardDto: UpdateBoardDto = {
        title: '제목',
        content: '내용',
        category: 'qna',
        tags: [{ name: 'test' }],
      };
      const boardId = 'boardId';

      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue([null]);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'create');
      jest.spyOn(boardRepository, 'update');
      jest.spyOn(boardRepository, 'findById').mockResolvedValue(existBoard);

      try {
        await boardsService.update(userId, updateBoardDto, boardId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('invalid_category');
      }
    });

    it('정상적인 글 업데이트', async () => {
      const userId = 'userId';
      const updateBoardDto: UpdateBoardDto = {
        title: '제목',
        content: '내용',
        category: 'qna',
        tags: [{ name: 'test' }],
      };
      const boardId = 'boardId';
      const categoryIds = [7];

      const newTag = new Tag();
      newTag.tagId = 1;
      newTag.name = 'test';

      const updatedTags = [newTag];

      const spyBoardRepoUpdate = jest.spyOn(boardRepository, 'update');
      jest.spyOn(categoryRepository, 'findIdByName').mockResolvedValue(categoryIds);
      jest.spyOn(tagRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'create').mockResolvedValue(newTag.tagId);
      await boardsService.update(userId, updateBoardDto, boardId);

      expect(spyBoardRepoUpdate).toBeCalledWith(
        userId,
        boardId,
        updateBoardDto,
        categoryIds,
        updatedTags,
      );
    });
  });

  describe('[게시글 추천] BoardsService.recommend()', () => {
    it('이미 추천되어있는 게시글은 추천수 감소, 삭제로직 호출 확인', async () => {
      const userId = 'userId';
      const boardId = 'boardId';

      const recommend = new Recommend();
      recommend.userId = userId;
      recommend.boardId = boardId;

      jest.spyOn(recommendRepository, 'findByUserAndBoard').mockResolvedValue(recommend);
      await boardsService.recommend(userId, boardId);

      expect(boardRepository.removeRecommend).toBeCalledWith(boardId);
      expect(recommendRepository.removeRecommend).toBeCalledWith(userId, boardId);
    });

    it('게시글의 새로운 추천은 추천수 증가, 추가로직 호출 확인', async () => {
      const userId = 'userId';
      const boardId = 'boardId';

      jest.spyOn(recommendRepository, 'findByUserAndBoard').mockResolvedValue(null);
      await boardsService.recommend(userId, boardId);

      expect(boardRepository.addRecommend).toBeCalledWith(boardId);
      expect(recommendRepository.addRecommend).toBeCalledWith(userId, boardId);
    });
  });

  describe('[게시글 조회수] BoardsService.views()', () => {
    it('viewRepository.add 호출 확인', async () => {
      const boardId = 'boardId';

      await boardsService.views(boardId);

      expect(viewRepository.add).toBeCalledWith(boardId);
    });
  });

  describe('[게시글 이미지 업로드] BoardsService.imageUpload()', () => {
    it('imageUploadToS3 호출하고 이미지의 url를 반환하는지 확인', async () => {
      const file = {
        originalname: 'test.jpg',
        mimetype: 'image/jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      const imageUploadDto: ImageUploadDto = { tempBoardId: 'tempBoardId' };

      jest.spyOn(utilsService, 'getUUID').mockReturnValue('uuid');
      jest.spyOn(awsService, 'imageUploadToS3').mockResolvedValue('imageUrl/uuid.jpg');
      const result = await boardsService.imageUpload(file, imageUploadDto);

      expect(result).toEqual({ imageUrl: 'imageUrl/uuid.jpg' });
    });
  });

  describe('[최근게시글] BoardsService.recent()', () => {
    it('boardRepo.recent 호출하고 결과값을 반환하는지 확인', async () => {
      jest.spyOn(boardRepository, 'recent').mockResolvedValue([]);
      const result = await boardsService.recent();

      expect(boardRepository.recent).toBeCalledWith(1);
      expect(boardRepository.recent).toBeCalledWith(7);
      expect(boardRepository.recent).toBeCalledWith(4);
      expect(boardRepository.recent).toBeCalledWith(10);
      expect(result).toEqual({
        notice: [],
        qna: [],
        knowledge: [],
        recruitment: [],
      });
    });
  });

  describe('[게시글 검색] BoardsService.search()', () => {
    it('boardRepo.search를 호출하고 결과값을 반환하는지 확인', async () => {
      const text = 'text';

      jest.spyOn(boardRepository, 'search').mockResolvedValue([]);
      const result = await boardsService.search(text);

      expect(boardRepository.search).toBeCalledWith(text);
      expect(result).toEqual([]);
    });
  });
});
