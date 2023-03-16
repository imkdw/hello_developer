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
  async create(board: Board): Promise<string> {
    const createdBoard = await this.boardRepository.save(board);
    return createdBoard.boardId;
  }

  async findAll(categorysIds: number[]) {
    const boards = await this.boardRepository.find({
      where: { categoryId1: categorysIds[0], categoryId2: categorysIds[1] || null },
    });

    return boards;
  }

  async findOne(boardId: string) {
    const _board = await this.boardRepository.findOne({ where: { boardId }, select: ['boardId'] });

    if (!_board) {
      return false;
    }

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
        'comments.comment',
        'view.viewCnt',
        'tag.name',
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

  async findByUserId(userId: string) {
    const boards = this.boardRepository.find({ where: { userId } });
    return boards;
  }
}
