import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    private dataSource: DataSource,
  ) {}

  /**
   * 게시글 신규 생성
   * @param board - 새로운 게시글 데이터
   * @returns 게시글 ID 반환
   */
  async create(board: Board) {
    await this.boardRepository.save(board);
  }

  async findAll(categorysIds: number[]) {
    const category1 = categorysIds[0];
    const category2 = categorysIds[1] ? categorysIds[1] : null;

    let boards = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.view', 'view')
      .leftJoinAndSelect('board.tags', 'tags')
      .leftJoinAndSelect('board.category2', 'category')
      .select([
        'board.boardId',
        'board.title',
        'board.content',
        'board.createdAt',
        'user.userId',
        'user.nickname',
        'user.profileImg',
        'view.viewCnt',
        'tags.name',
        'category.name',
      ])
      .where('board.category1 = :category1', { category1 })
      .orderBy('board.createdAt', 'DESC');

    if (category2) {
      boards = boards
        .andWhere('board.category2 = :category2', { category2 })
        .orderBy('board.createdAt', 'DESC');
    }

    return await boards.getMany();
  }

  async detail(boardId: string) {
    const _board = await this.boardRepository.findOne({ where: { boardId }, select: ['boardId'] });

    if (!_board) {
      return false;
    }

    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentsUser')
      .leftJoinAndSelect('board.view', 'view')
      .leftJoinAndSelect('board.tags', 'tag')
      .leftJoinAndSelect('board.category1', 'category1')
      .leftJoinAndSelect('board.category2', 'category2')
      .leftJoinAndSelect('board.recommends', 'recommend')
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
        'comments.comment',
        'commentsUser.nickname',
        'commentsUser.profileImg',
        'commentsUser.userId',
        'view.viewCnt',
        'tag.name',
        'category1.name',
        'category2.name',
        'recommend.userId',
      ])
      .where('board.boardId = :boardId', { boardId })
      .getOne();

    return board;
  }

  async remove(userId: string, boardId: string) {
    await this.boardRepository.delete({ userId, boardId });
  }

  async update(
    userId: string,
    boardId: string,
    updateBoardDto: UpdateBoardDto,
    categoryIds: number[],
    updatedTags: Tag[],
  ) {
    const { title, content } = updateBoardDto;
    const queryBuilder = this.boardRepository.createQueryBuilder();
    const existBoard = await this.boardRepository.findOne({
      where: { boardId },
      relations: ['tags'],
    });
    const currentTags = existBoard.tags;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
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

  async findHistoryByUserId(userId: string) {
    const boards = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.category1', 'category1')
      .leftJoinAndSelect('board.category2', 'category2')
      .select([
        'board.boardId',
        'board.title',
        'board.createdAt',
        'category1.name',
        'category2.name',
      ])
      .where('board.userId = :userId', { userId })
      .getMany();

    return boards;
  }

  async addRecommend(boardId: string) {
    const board = await this.findById(boardId);

    if (board) {
      await this.boardRepository.update(boardId, { recommendCnt: board.recommendCnt + 1 });
    }
  }

  async removeRecommend(boardId: string) {
    const board = await this.findById(boardId);

    if (board) {
      await this.boardRepository.update(boardId, { recommendCnt: board.recommendCnt - 1 });
    }
  }

  async recent(categoryId: number) {
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.view', 'view')
      .select([
        'board.boardId',
        'board.title',
        'board.createdAt',
        'user.nickname',
        'user.profileImg',
        'view.viewCnt',
      ])
      .where('board.category1 = :category1', { category1: categoryId })
      .orderBy('board.createdAt', 'DESC')
      .limit(4)
      .getMany();

    return board;
  }

  async search(text: string) {
    let boards = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.view', 'view')
      .leftJoinAndSelect('board.tags', 'tags')
      .leftJoinAndSelect('board.category2', 'category')
      .select([
        'board.boardId',
        'board.title',
        'board.content',
        'board.createdAt',
        'user.userId',
        'user.nickname',
        'user.profileImg',
        'view.viewCnt',
        'tags.name',
        'category.name',
      ])
      .where('board.title like :text', { text: `%${text}%` })
      .orderBy('board.createdAt', 'DESC');

    return await boards.getMany();
  }

  async findById(boardId: string) {
    return this.boardRepository.findOne({ where: { boardId } });
  }
}
