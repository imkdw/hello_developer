import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsCategoryEntity } from 'src/entities/boards-category.entity';
import { BoardsEntity } from 'src/entities/boards.entity';
import { BoardTagsEntity, TagsEntity } from 'src/entities/tags.entity';
import { BoardsRepository } from 'src/repositories/boards.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardsEntity, BoardsCategoryEntity, TagsEntity, BoardTagsEntity])],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, BoardsCategoryEntity, TagsEntity, BoardTagsEntity],
  exports: [TypeOrmModule],
})
export class BoardsModule {}
