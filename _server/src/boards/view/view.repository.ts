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
}
