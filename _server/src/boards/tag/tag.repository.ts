import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findByName(name: string): Promise<Tag | null> {
    return await this.tagRepository.findOne({ where: { name } });
  }

  async create(name: string): Promise<number> {
    const createdTag = await this.tagRepository.save({ name });
    return createdTag.tagId;
  }
}
