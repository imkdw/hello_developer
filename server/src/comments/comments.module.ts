import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Module({
  providers: [CommentsService]
})
export class CommentsModule {}
