import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { CategoryRepository } from './category/category.repository';
import { Tag } from './tag/tag.entity';
import { TagRepository } from './tag/tag.repository';
import { View } from './view/view.entity';
import { ViewRepository } from './view/view.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Category, Tag, View])],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    JwtStrategy,
    BoardRepository,
    CategoryRepository,
    TagRepository,
    ViewRepository,
  ],
  exports: [TypeOrmModule, BoardRepository, CategoryRepository, TagRepository, ViewRepository],
})
export class BoardsModule {}
