import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Category } from './category/category.entity';
import { CategoryRepository } from './category/category.repository';
import { Recommend } from './recommend/recommend.entity';
import { RecommendRepository } from './recommend/recommend.repository';
import { Tag } from './tag/tag.entity';
import { TagRepository } from './tag/tag.repository';
import { View } from './view/view.entity';
import { ViewRepository } from './view/view.repository';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Category, Tag, View, Recommend]),
    UtilsModule,
    AwsModule,
  ],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    JwtStrategy,
    BoardRepository,
    CategoryRepository,
    TagRepository,
    ViewRepository,
    RecommendRepository,
  ],
  exports: [
    TypeOrmModule,
    BoardRepository,
    CategoryRepository,
    TagRepository,
    ViewRepository,
    RecommendRepository,
  ],
})
export class BoardsModule {}
