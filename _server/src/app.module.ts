import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { PasswordModule } from './password/password.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { User } from './users/user.entity';
import { Board } from './boards/board.entity';
import { Category } from './boards/category/category.entity';
import { Tag } from './boards/tag/tag.entity';
import { View } from 'typeorm/schema-builder/view/View';
import { Recommend } from './boards/recommend/recommend.entity';
import { BoardsService } from './boards/boards.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE,
    //   host: process.env.DATABASE_HOST,
    //   port: process.env.DATABASE_PORT,
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   name: process.env.DATABASE_NAME,
    //   entities: [User, Board, Category, Recommend, Tag, View, Comment],
    //   synchronize: true,
    //   dropSchema: true,
    // }),
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
      entities: [User, Board, Category, Tag, View, Recommend],
      synchronize: true,
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([Board, Category, Tag]),
  ],
  controllers: [],
  providers: [BoardsService],
})
export class AppModule implements OnModuleInit {
  constructor(private boardsService: BoardsService) {}

  async onModuleInit() {
    await this.boardsService.createDefaultCategorys();
  }
}
