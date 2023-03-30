import { Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { User } from './users/user.entity';
import { Board } from './boards/board.entity';
import { Category } from './boards/category/category.entity';
import { Tag } from './boards/tag/tag.entity';
import { View } from './boards/view/view.entity';
import { Recommend } from './boards/recommend/recommend.entity';
import { Comment } from './comments/comment.entity';
import { HttpExceptionFilter } from './http-exception.filter';
import { UtilsModule } from './utils/utils.module';
import { CategoryRepository } from './boards/category/category.repository';
import configuration from './config/configuration';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { AwsService } from './aws/aws.service';
import { AwsModule } from './aws/aws.module';

// TODO: 환경변수 처리하기
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '..', '.env'),
      isGlobal: true,
      load: [configuration],
    }),
    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE,
    //   host: process.env.DATABASE_HOST,
    //   port: process.env.DATABASE_PORT,
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   entities: [User, Board, Category, Tag, Recommend, Comment, View],
    //   synchronize: true,
    //   dropSchema: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'hello_developer_migration',
      entities: [User, Board, Category, Tag, Recommend, Comment, View],
      synchronize: true,
      dropSchema: true,
      poolSize: 100,
    }),
    TypeOrmModule.forFeature([Board, Category, Tag]),
    AuthModule,
    BoardsModule,
    CommentsModule,
    EmailModule,
    UtilsModule,
    UsersModule,
    UtilsModule,
    MorganModule,
    AwsModule,
  ],
  controllers: [],
  providers: [
    CategoryRepository,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: MorganInterceptor('combined'),
    // },
    AwsService,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private categoryRepository: CategoryRepository) {}

  async onModuleInit() {
    await this.categoryRepository.createDefaultCategorys();
  }
}
