import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { EmailModule } from './email/email.module';
import { BoardsEntity } from './entities/boards.entity';
import { BoardsCategoryEntity } from './entities/boards-category.entity';
import { BoardsRepository } from './repositories/boards.repository';
import { BoardTagsEntity, TagsEntity } from './entities/tags.entity';

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
      entities: [UsersEntity, BoardsEntity, BoardsCategoryEntity, TagsEntity, BoardTagsEntity],
      synchronize: true,
      dropSchema: true,
    }),
    EmailModule,
  ],
  providers: [BoardsRepository],
})
export class AppModule {
  constructor(private boardsRepository: BoardsRepository) {
    this.boardsRepository.createDefaultCategorys();
  }
}
