import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardCategoryEntity } from './board-category.entity';
import { defaultCategorys } from './board-category.entity';

@Injectable()
export class BoardCategoryRepository {
  constructor(
    @InjectRepository(BoardCategoryEntity)
    private readonly boardCategoryRepository: Repository<BoardCategoryEntity>,
  ) {}

  // 카테고리 이름으로 아이디 조회
  async findCategoryIdByNames(categorys: string) {
    const categoryNames = categorys.split('-');
    const categoryIds = await Promise.all(
      categoryNames.map(async (name) => {
        const row = await this.boardCategoryRepository.findOne({ where: { name } });
        return row.categoryId;
      }),
    );

    return categoryIds;
  }

  // board_category에 기본 데이터 저장
  async createDefaultCategorys() {
    for (const defaultCategory of defaultCategorys) {
      const user = this.boardCategoryRepository.create(defaultCategory);
      await this.boardCategoryRepository.save(user);
    }
  }
}
