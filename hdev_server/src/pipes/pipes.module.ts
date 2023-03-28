import { Module } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';

@Module({
  providers: [ValidationPipe],
})
export class PipesModule {}
