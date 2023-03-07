import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardTag } from './board-tag.entity';

@Injectable()
export class BoardTagRepository {
  constructor(
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
  ) {}
}
