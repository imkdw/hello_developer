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
}
