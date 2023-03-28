import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UtilsService } from './utils.service';

@Module({
  imports: [ConfigModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
