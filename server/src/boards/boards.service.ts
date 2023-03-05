import { Injectable } from '@nestjs/common';
import { BoardsCategoryEntity } from 'src/entities/boards-category.entity';
import { BoardsRepository } from 'src/repositories/boards.repository';
import { v4 } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards = [];

  constructor(private readonly boardsRepository: BoardsRepository, private readonly boardsCategoryRepository: BoardsCategoryEntity) {}

  /**
   * 게시글 생성
   * @param createdBoardDto - 게시글 생성에 필요한 데이터
   */
  async createBoard(createdBoardDto: CreateBoardDto) {
    await this.boardsRepository.createBoard(createdBoardDto);
  }

  /**
   * 특정 게시글 조회
   */
  async findOne(id: number) {
    return this.boards.filter((board) => board.id === id);
  }
}
