import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { createCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  /**
   * [POST] /comments - 댓글 생성
   * @param createCommentDto - 댓글 데이터
   * @return - 댓글 ID
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createCommentDto: createCommentDto) {
    const commentId = await this.commentsService.create(req.user.userId, createCommentDto);
    return { commentId };
  }
}
