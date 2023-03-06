import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardTagEntity } from './board-tag.entity';

@Injectable()
export class BoardTagRepository {
  constructor(
    @InjectRepository(BoardTagEntity)
    private readonly boardTagRepository: Repository<BoardTagEntity>,
  ) {}

  /**
   * board_tags 테이블에 boardId와 tagId 저장
   * @param boardId - 게시글 아이디
   * @param tagIds - 태그 아이디 목록
   */
  async saveBoardTags(boardId: string, tagIds: number[]) {
    console.log(boardId, tagIds);

    for (const tagId of tagIds) {
      const newBoardTag = new BoardTagEntity();
      newBoardTag.boardId = boardId;
      newBoardTag.tagId = tagId;
      await this.boardTagRepository.save(newBoardTag);
    }
  }
}
