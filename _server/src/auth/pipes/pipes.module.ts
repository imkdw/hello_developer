import { Module } from '@nestjs/common';
import { AuthValidationPipe } from './auth-validation.pipe';

@Module({
  providers: [AuthValidationPipe],
})
export class PipesModule {}
