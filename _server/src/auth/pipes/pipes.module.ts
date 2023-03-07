import { Module } from '@nestjs/common';
import { AuthValidationPipe } from './validation.pipe';

@Module({
  providers: [AuthValidationPipe],
})
export class PipesModule {}
