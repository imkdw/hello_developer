import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards = [];

  /**
   * 게시글 생성
   * @param createdBoardDto - 게시글 생성에 필요한 데이터
   */
  async createBoard(createdBoardDto: CreateBoardDto) {
    const { title, content, tags, category } = createdBoardDto;
    this.boards.push({
      id: this.boards.length + 1,
      title,
      content,
      tags: tags.map((tag) => tag),
      category,
    });
  }

  /**
   * 특정 게시글 조회
   */
  async findOne(id: number) {
    return this.boards.filter((board) => board.id === id);
  }
}
