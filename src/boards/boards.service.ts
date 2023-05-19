import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CategoryRepository } from './category/category.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';
import { TagRepository } from './tag/tag.repository';
import { ViewRepository } from './view/view.repository';
import { RecommendRepository } from './recommend/recommend.repository';
import { UtilsService } from '../utils/utils.service';
import { AwsService } from '../aws/aws.service';
import { ImageUploadDto } from './dto/image-upload.dto';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    private boardRepository: BoardRepository,
    private categoryRepository: CategoryRepository,
    private tagRepository: TagRepository,
    private viewRepository: ViewRepository,
    private recommendRepository: RecommendRepository,
    private utilsService: UtilsService,
    private awsService: AwsService,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, createBoardDto: CreateBoardDto) {
    const { title, content, category, tags, tempBoardId } = createBoardDto;

    /** category 테이블에서 category_id 조회 */
    const categoryIds = await this.categoryRepository.findIdByName(category);
    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    /** 태그 존재여부 확인해서 추가 */
    const tagsArr = [];
    for (const tag of tags) {
      if (tag.name.length === 0) {
        continue;
      }

      const existTag = await this.tagRepository.findByName(tag.name);

      if (existTag) {
        tagsArr.push(existTag);
      } else {
        const newTag = new Tag();
        newTag.name = tag.name;
        tagsArr.push(newTag);
      }
    }

    const boardId = this.utilsService.getUUID();

    /** 본문 사진 임시 게시글 ID -> 실제 게시글 ID로 변경 */
    const replaceRegExp = new RegExp(`${tempBoardId}`, 'g');
    const replaceContent = content.replace(replaceRegExp, boardId);

    const newBoard = new Board();
    newBoard.boardId = boardId;
    newBoard.tempBoardId = tempBoardId;
    newBoard.userId = userId;
    newBoard.title = title;
    newBoard.content = replaceContent;
    newBoard.categoryId1 = categoryIds[0];
    newBoard.categoryId2 = categoryIds[1] || null;
    newBoard.tags = tagsArr;

    /** 게시글 저장 -> 게시글 조회수 저장 트랜잭션 처리 */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await this.boardRepository.create(queryRunner, newBoard);
      await this.viewRepository.create(queryRunner, boardId);
      await queryRunner.commitTransaction();
      const oldPath = `boards_image/${tempBoardId}`;
      const newPath = `boards_image/${boardId}`;
      await this.awsService.changeFolderName(oldPath, newPath);
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return boardId;
  }

  /**
   * 특정 카테고리의 모든 게시글 가져오기
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  async findAll(category1: string, category2: string) {
    const categoryIds = await this.categoryRepository.findIdByName(category1 + '-' + category2);
    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    const boards = await this.boardRepository.findAll(categoryIds);

    return boards;
  }

  /**
   * 특정 게시글 가져오기
   * @param boardid - 특정 게시글 아이디
   */
  async detail(boardId: string) {
    const board = await this.boardRepository.detail(boardId);

    if (!board) {
      throw new NotFoundException('board_not_found');
    }

    return board;
  }

  /**
   * 게시글 삭제
   * @param userId - 삭제를 요청한 ID
   * @param boardId - 게시글 ID
   */
  async remove(userId: string, boardId: string) {
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new NotFoundException('board_not_found');
    }

    /** 작성자와 삭제요청 유저가 일치할때만 글 삭제 */
    if (board.userId === userId) {
      await this.boardRepository.remove(userId, boardId);
    } else {
      throw new ForbiddenException('user_mismatch');
    }
  }

  /**
   * 게시글 수정
   * @param userId - 게시글 수정을 요청한 유저 아이디
   * @param updateBoardDto - 게시글 수정 데이터
   * @param boardId - 게시글 수정을 요청한 아이디
   */
  async update(userId: string, updateBoardDto: UpdateBoardDto, boardId: string) {
    const board = await this.boardRepository.findById(boardId);
    if (board.userId !== userId) {
      throw new ForbiddenException('user_mismatch');
    }

    const { tags, category } = updateBoardDto;

    const categoryIds = await this.categoryRepository.findIdByName(category);
    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    const updatedTags = [];
    for (const tag of tags) {
      const existTag = await this.tagRepository.findByName(tag.name);

      if (existTag) {
        updatedTags.push(existTag);
      } else {
        const tagId = await this.tagRepository.create(tag.name);
        updatedTags.push({ tagId, name: tag.name });
      }
    }

    await this.boardRepository.update(userId, boardId, updateBoardDto, categoryIds, updatedTags);
  }

  async recommend(userId: string, boardId: string) {
    const existRecommend = await this.recommendRepository.findByUserAndBoard(userId, boardId);

    if (existRecommend) {
      // 이미 추천이 되어있을경우 카운트 삭제
      await this.boardRepository.removeRecommend(boardId);
      await this.recommendRepository.removeRecommend(userId, boardId);
    } else {
      // 추천이 안되어있으면 카운트 추가
      await this.boardRepository.addRecommend(boardId);
      await this.recommendRepository.addRecommend(userId, boardId);
    }
  }

  async views(boardId: string) {
    await this.viewRepository.add(boardId);
  }

  async imageUpload(file: Express.Multer.File, imageUploadDto: ImageUploadDto) {
    const imageName = this.utilsService.getUUID();
    const tempBoardId = JSON.parse(JSON.stringify(imageUploadDto)).tempBoardId;

    const ext = file.originalname.split('.');
    const fileName = `boards_image/${tempBoardId}/${imageName}.${ext[ext.length - 1]}`;
    const imageUrl = await this.awsService.imageUploadToS3(fileName, file);
    return { imageUrl };
  }

  async recent() {
    /**
     * 카테고리 ID (고정값)
     * 공지사항 : 1
     * 지식공유 : 4
     * 질문답변 : 7
     * 구인구직 : 10
     */
    const notice = await this.boardRepository.recent(1);
    const qna = await this.boardRepository.recent(7);
    const knowledge = await this.boardRepository.recent(4);
    const recruitment = await this.boardRepository.recent(10);
    return { notice, qna, knowledge, recruitment };
  }

  async search(text: string) {
    const result = await this.boardRepository.search(text);
    return result;
  }
}
