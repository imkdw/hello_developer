import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';
import { BoardCategoryEntity } from './boards/board_category/board-category.entity';
import { BoardRepository } from './boards/board/board.repository';
import { UserEntity } from './users/user/user.entity';
import { BoardEntity } from './boards/board/board.entity';
import { TagEntity } from './boards/board_tag/tag.entity';
import { BoardTagEntity } from './boards/board_tag/board-tag.entity';
import { BoardViewEntity } from './boards/board_view/board-view.entity';
import { BoardRecommendEntity } from './boards/board_recommend/board-recommend.entity';
import { BoardCategoryRepository } from './boards/board_category/board-category.repository';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    BoardsModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'hello_developer_migration',
      entities: [UserEntity, BoardEntity, BoardCategoryEntity, TagEntity, BoardTagEntity, BoardViewEntity, BoardRecommendEntity],
      synchronize: true,
      dropSchema: true,
    }),
    CommentsModule,
    UsersModule,
  ],
  providers: [BoardCategoryRepository],
})
export class AppModule {
  constructor(private boardCategoryRepository: BoardCategoryRepository) {
    this.boardCategoryRepository.createDefaultCategorys();
  }
}
