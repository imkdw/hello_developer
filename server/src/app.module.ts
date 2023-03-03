import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PasswordService } from './password/password.service';
import { PasswordModule } from './password/password.module';
import { EmailModule } from './email/email.module';

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
      entities: [UserEntity],
      synchronize: true,
      dropSchema: true,
    }),
    EmailModule,
  ],
  providers: [PasswordService],
})
export class AppModule {}
