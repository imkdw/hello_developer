import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommend } from './recommend.entity';

@Injectable()
export class RecommendRepository {
  constructor(
    @InjectRepository(Recommend)
    private readonly recommendRepository: Repository<Recommend>,
  ) {}

  async findByUserAndBoard(userId: string, boardId: string) {
    return await this.recommendRepository.findOne({ where: { userId, boardId } });
  }

  async removeRecommend(userId: string, boardId: string) {
    await this.recommendRepository.delete({ userId, boardId });
  }

  async addRecommend(userId: string, boardId: string) {
    await this.recommendRepository.save({ userId, boardId });
  }
}
