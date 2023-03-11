import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { createCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {}

  async create(userId: string, createCommentDto: createCommentDto): Promise<number> {
    const { boardId, content } = createCommentDto;

    try {
      const newComment = new Comment();
      newComment.boardId = boardId;
      newComment.userId = userId;
      newComment.content = content;
      const createdComment = await this.commentRepository.save(newComment);

      return createdComment.commentId;
    } catch (err: any) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
