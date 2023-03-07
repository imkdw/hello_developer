import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../board.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardCategoryRepository: Repository<Board>,
  ) {}
}
