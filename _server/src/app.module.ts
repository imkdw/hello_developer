import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { PasswordModule } from './password/password.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    CommentsModule,
    EmailModule,
    PasswordModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
