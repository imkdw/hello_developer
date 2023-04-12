import { Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AwsModule } from './aws/aws.module';
import { AppController } from './app.controller';

function setEnv(nodeEnv: string) {
  switch (nodeEnv) {
    case 'development':
      return ['.env.development'];
    case 'test':
      return ['.env.test'];
    case 'production':
      return ['.env.production'];
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [User, Board, Category, Tag, Recommend, Comment, View],
        synchronize: true,
      }),
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
  providers: [
    CategoryRepository,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  constructor(private categoryRepository: CategoryRepository) {}

  async onModuleInit() {
    await this.categoryRepository.createDefaultCategorys();
  }
}
