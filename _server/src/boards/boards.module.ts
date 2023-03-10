import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Board } from './board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { Tag } from './tag/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Category, Tag])],
  controllers: [BoardsController],
  providers: [BoardsService, JwtStrategy],
})
export class BoardsModule {}
