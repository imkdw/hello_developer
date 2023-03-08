import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { PasswordModule } from './password/password.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Board } from './boards/board.entity';
import { Category } from './boards/category/category.entity';
import { Recommend } from './boards/recommend/recommend.entity';
import { Tag } from './boards/tag/tag.entity';
import { View } from './boards/view/view.entity';
import { Comment } from './comments/comment.entity';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    CommentsModule,
    EmailModule,
    PasswordModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'hello_developer_migration',
      entities: [User, Board, Category, Recommend, Tag, View, Comment],
      synchronize: true,
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
