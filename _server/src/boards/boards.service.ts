import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Board } from './board.entity';
import { Category, defaultCategorys } from './category/category.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';
import { View } from './view/view.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(View) private viewRepository: Repository<View>,
    private dataSource: DataSource,
  ) {}

  /**
   * 게시글 생성
   * @param userId - 작성자 아이디
   * @param createBoardDto - 게시글 생성 데이터
   */
  async create(userId: string, createBoardDto: CreateBoardDto) {
    const { title, content, category, tags } = createBoardDto;

    const categoryIds = await this.findCategoryIdByName(category);

    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    const tagsArr = [];
    for (const tag of tags) {
      const existTag = await this.tagRepository.findOne({ where: { name: tag.name } });

      if (existTag) {
        tagsArr.push(existTag);
      } else {
        const newTag = new Tag();
        newTag.name = tag.name;
        tagsArr.push(newTag);
      }
    }

    const createdBoard = await this.boardRepository.save({
      userId,
      title,
      content,
      categoryId1: categoryIds[0],
      categoryId2: categoryIds[1] || null,
      tags: tagsArr,
    });

    const boardId = createdBoard.boardId;

    await this.viewRepository.save({
      boardId,
    });

    return boardId;
  }

  /**
   * 특정 카테고리의 모든 게시글 가져오기
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  async findAll(category1: string, category2: string) {
    const categoryIds = await this.findCategoryIdByName(category1 + '-' + category2);

    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    // TODO: 게시글 목록 및 관련데이터 모두 불러오는 기능 구현필요
    const boards = this.boardRepository.find({
      where: { categoryId1: categoryIds[0], categoryId2: categoryIds[1] || null },
    });
    return boards;
  }

  /**
   * 특정 게시글 가져오기
   * @param boardid - 특정 게시글 아이디
   */
  async findOne(boardId: string): Promise<Board> {
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.comments', 'comments')
      .leftJoinAndSelect('board.view', 'view')
      .leftJoinAndSelect('board.tags', 'tag')
      .select([
        'board.boardId',
        'board.title',
        'board.content',
        'board.createdAt',
        'board.recommendCnt',
        'user.userId',
        'user.nickname',
        'user.profileImg',
        'comments.commentId',
        'comments.createdAt',
        'comments.content',
        'view.viewCnt',
        'tag.name',
      ])
      .where('board.boardId = :boardId', { boardId })
      .getOne();

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
    const board = await this.findOne(boardId);

    /** 작성자와 삭제요청 유저가 일치할때만 글 삭제 */
    if (board.userId === userId) {
      await this.boardRepository.delete({ userId, boardId });
    }
  }

  /**
   * 게시글 수정
   * @param userId - 게시글 수정을 요청한 유저 아이디
   * @param updateBoardDto - 게시글 수정 데이터
   * @param boardId - 게시글 수정을 요청한 아이디
   */
  async update(userId: string, updateBoardDto: UpdateBoardDto, boardId: string) {
    const { title, content, tags, category } = updateBoardDto;

    const categoryIds = await this.findCategoryIdByName(category);
    const updatedTags = [];
    for (const tag of tags) {
      const existTag = await this.tagRepository.findOne({ where: { name: tag.name } });

      if (existTag) {
        updatedTags.push(existTag);
      } else {
        const createdTag = await this.tagRepository.save({ name: tag.name });
        updatedTags.push({ tagId: createdTag.tagId, name: createdTag.name });
      }
    }

    const queryBuilder = this.boardRepository.createQueryBuilder();
    const board = await this.boardRepository.findOne({ where: { boardId }, relations: ['tags'] });
    const currentTags = board.tags;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    /** 트랜잭션을 사용하여 테이블 내용 업데이트 */
    try {
      await queryRunner.startTransaction();

      /** 태그를 제외한 게시글 내용 업데이트 */
      await this.boardRepository.update(
        { userId, boardId },
        {
          title,
          content,
          categoryId1: categoryIds[0],
          categoryId2: categoryIds[1] || null,
        },
      );

      /** 태그 내용 업데이트 */
      await queryBuilder.relation(Board, 'tags').of(boardId).remove(currentTags);
      await queryBuilder.relation(Board, 'tags').of(boardId).add(updatedTags);
      await queryRunner.commitTransaction();
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 카테고리 이름으로 아이디 찾기
   * @param category - 카테고리 문자열 / ex. qna-tech, qna
   * @returns 카테고리 아이디를 담은 숫자형 배열 반환
   */
  async findCategoryIdByName(category: string): Promise<number[]> {
    const categoryArr = category.split('-');

    const categoryIds = await Promise.all(
      categoryArr.map(async (category) => {
        const row = await this.categoryRepository.findOneBy({ name: category });
        if (row) {
          return row.categoryId;
        }

        return null;
      }),
    );

    return categoryIds;
  }

  /**
   * 초기 구성시 카테고리에 기본값 저장
   */
  async createDefaultCategorys() {
    for (const defaultCategory of defaultCategorys) {
      const category = this.categoryRepository.create(defaultCategory);
      await this.categoryRepository.save(category);
    }
  }
}
