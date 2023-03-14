import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../board.entity';
import { Category, defaultCategorys } from './category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findIdByName(category: string) {
    const categoryArr = category.split('-');

    const categoryIds = await Promise.all(
      categoryArr.map(async (category) => {
        const row = await this.categoryRepository.findOne({ where: { name: category } });
        if (row) {
          return row.categoryId;
        }

        return null;
      }),
    );

    return categoryIds;
  }

  async createDefaultCategorys() {
    const category = this.categoryRepository.create(defaultCategorys);
    await this.categoryRepository.save(category);
  }
}
