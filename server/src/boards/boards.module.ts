import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardCategoryEntity } from 'src/boards/board_category/board-category.entity';
import { BoardTagEntity } from 'src/boards/board_tag/board-tag.entity';
import { BoardEntity } from 'src/boards/board/board.entity';
import { TagEntity } from 'src/boards/board_tag/tag.entity';
import { BoardRepository } from 'src/boards/board/board.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardTagRepository } from './board_tag/board-tag.repository';
import { BoardCategoryRepository } from './board_category/board-category.repository';
import { TagRepository } from './board_tag/tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, BoardCategoryEntity, TagEntity, BoardTagEntity])],
  controllers: [BoardsController],
  providers: [BoardsService, BoardRepository, BoardCategoryRepository, BoardTagRepository, TagRepository],
  exports: [TypeOrmModule],
})
export class BoardsModule {}

// private readonly boardRepository: Repository<BoardEntity>,
// private readonly tagRepository: TagRepository,
// private readonly boardTagsRepository: BoardTagRepository,
// private readonly boardCategoryRepository: BoardCategoryRepository,
