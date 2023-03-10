import { Module } from '@nestjs/common';
import { BoardValidationPipe } from './board-validation.pipe';

@Module({
  providers: [BoardValidationPipe],
})
export class PipesModule {}
