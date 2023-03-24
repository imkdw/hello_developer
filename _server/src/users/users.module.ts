import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from '../boards/boards.module';
import { CommentsModule } from '../comments/comments.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UtilsModule } from '../utils/utils.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BoardsModule, CommentsModule, UtilsModule, AwsModule],
  providers: [UsersService, UserRepository, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
