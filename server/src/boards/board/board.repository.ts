import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { BoardEntity } from 'src/boards/board/board.entity';
import { TagRepository } from '../board_tag/tag.repository';
import { BoardTagRepository } from '../board_tag/board-tag.repository';
import { BoardCategoryRepository } from '../board_category/board-category.repository';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    private readonly tagRepository: TagRepository,
    private readonly boardTagsRepository: BoardTagRepository,
    private readonly boardCategoryRepository: BoardCategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 게시글 생성
   * @param userId - 게시글 작성자 ID
   * @param createdBoardDto - 게시글 작성 데이터
   */
  async createBoard(userId: string, createdBoardDto: CreateBoardDto) {
    const { title, content, category, tags } = createdBoardDto;
    const categoryIds = await this.boardCategoryRepository.findCategoryIdByNames(category);

    const newBoard = new BoardEntity();
    newBoard.userId = userId;
    newBoard.title = title;
    newBoard.content = content;
    newBoard.categoryId1 = categoryIds[0];
    newBoard.categoryId2 = categoryIds[1] ? categoryIds[1] : null;

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const boardId = (await this.boardRepository.save(newBoard)).boardId;
      const tagIds = await this.tagRepository.saveTagsAndReturnId(tags);
      await this.boardTagsRepository.saveBoardTags(boardId, tagIds);
      await queryRunner.commitTransaction();
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
