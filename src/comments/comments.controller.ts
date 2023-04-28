import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UsePipes,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiCreate, ApiUpdate } from './comments.swagger';
import { ApiRemove } from 'src/boards/boards.swagger';

@Controller('comments')
@ApiTags('댓글 API')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  /**
   * [POST] /comments - 댓글 작성 API
   * @param createCommentDto - 작성한 댓글 데이터
   */
  @ApiCreate('댓글 작성시 사용하는 API')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    const commentId = await this.commentsService.create(req.user.userId, createCommentDto);
    return { commentId };
  }

  /**
   * [PATCH] /comments/:commentId - 댓글 수정 API
   * @param commentId - 댓글 아이디
   * @param updateCommentDto - 수정한 댓글 데이터
   */
  @ApiUpdate('댓글 수정시 사용하는 API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:commentId')
  async update(
    @Req() req,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentsService.update(req.user.userId, commentId, updateCommentDto);
  }

  /**
   * [DELETE] /comments/:commentId - 댓글 삭제 API
   */
  @ApiRemove('댓글을 삭제할때 사용하는 API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  async remove(@Req() req, @Param('commentId', ParseIntPipe) commentId: number) {
    await this.commentsService.remove(req.user.userId, commentId);
  }
}
