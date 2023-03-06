import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardRecommendEntity } from './board-recommend.entity';

@Injectable()
export class BoardCategoryRepository {
  constructor(
    @InjectRepository(BoardRecommendEntity)
    private readonly boardRecommendRepository: Repository<BoardRecommendEntity>,
  ) {}
}
