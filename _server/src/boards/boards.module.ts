import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Board } from './board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { Tag } from './tag/tag.entity';
import { View } from './view/view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Category, Tag, View])],
  controllers: [BoardsController],
  providers: [BoardsService, JwtStrategy],
  exports: [TypeOrmModule],
})
export class BoardsModule {}
