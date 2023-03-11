import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Board } from './board.entity';
import { Category, defaultCategorys } from './category/category.entity';
import { CreateBoardDto } from './dto/create-board.dto';
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

    try {
      const tagsArr = [];
      for (const tag of tags) {
        const existingTag = await this.tagRepository.findOne({ where: { name: tag.name } });

        if (existingTag) {
          tagsArr.push(existingTag);
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
    } catch (err: any) {
      console.log(err.message);
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 특정 카테고리의 모든 게시글 가져오기
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  async findAll(category1: string, category2: string) {
    const categoryIds = await this.findCategoryIdByName(category1 + '-' + category2);

    // TODO: 게시글 목록 및 관련데이터 모두 불러오는 기능 구현필요
    try {
      return [];
    } catch (err: any) {
      console.log(err.message);
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 특정 게시글 가져오기
   * @param boardid - 특정 게시글 아이디
   */
  async findOne(boardId: string) {
    const board = this.boardRepository
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
      .getMany();

    return board;
  }

  /**
   * 카테고리 이름으로 아이디 찾기
   * @param category - 카테고리 문자열 / ex. qna-tech, qna
   * @returns 카테고리 아이디를 담은 숫자형 배열 반환
   */
  async findCategoryIdByName(category: string): Promise<number[]> {
    const categoryArr = category.split('-');

    try {
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
    } catch (err: any) {
      console.log(err.message);
      throw new InternalServerErrorException(err);
    }
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
