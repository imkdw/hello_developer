import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/entities/boards.entity';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { BoardsCategoryEntity } from 'src/entities/boards-category.entity';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(BoardsEntity)
    private readonly boardsRepository: Repository<BoardsEntity>,
    private readonly boardsCategoryRepository: Repository<BoardsCategoryEntity>,
  ) {}

  async createBoard(createdBoardDto: CreateBoardDto) {
    /**
     * 1. 카테고리 아이디를 가져옴
     * 2.
     */
    const { title, content, category, tags } = createdBoardDto;
    const board = new BoardsEntity();

    const categorys = category.split('-');
    const categoryIds = await Promise.all(
      categorys.map(async (category) => {
        await this.findCategoryIdByName(category);
      }),
    );

    console.log(categoryIds);
  }

  async findCategoryIdByName(name: string) {
    return await this.boardsCategoryRepository.findOne({ where: { name } });
  }
}
