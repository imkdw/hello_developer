import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
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
import configuration from './config/configuration';
import { AwsModule } from './aws/aws.module';
import { AppController } from './app.controller';
import { GoogleOAuthMiddleware } from './auth/middlewares/google-auth.middleware';
import { JwtMiddleware } from './auth/middlewares/jwt.middleware';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';

@Module({
  imports: [
    // rate limit
    ThrottlerModule.forRoot({
      ttl: 60, // N초당 M번의 API 요청을 제어할떄 설정하는 N
      limit: 10, // 60초당 10번의 요청을 받겠다는 의미
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      load: [configuration],
      isGlobal: true,
    }),
    process.env.NODE_ENV === 'development'
      ? TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '1234',
          database: 'hello_developer',
          entities: [User, Board, Category, Tag, Recommend, Comment, View],
          synchronize: true,
        })
      : TypeOrmModule.forRootAsync({
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
          }),
        }),
    AuthModule,
    BoardsModule,
    CommentsModule,
    EmailModule,
    UtilsModule,
    UsersModule,
    UtilsModule,
    AwsModule,
    ChatModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GoogleOAuthMiddleware)
      .forRoutes({ path: '/auth/google', method: RequestMethod.GET });

    consumer.apply(JwtMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
