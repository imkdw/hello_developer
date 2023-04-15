import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { View } from './view.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViewRepository {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
  ) {}

  async create(boardId: string) {
    await this.viewRepository.save({ boardId });
  }

  async findOne(boardId: string) {
    return await this.viewRepository.findOne({ where: { boardId } });
  }

  async add(boardId: string) {
    const view = await this.findOne(boardId);
    await this.viewRepository.update(view.viewId, { viewCnt: view.viewCnt + 1 });
  }
}
