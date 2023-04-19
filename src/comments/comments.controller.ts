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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('comments')
@ApiTags('댓글 API')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  /**
   * [POST] /comments - 댓글 작성 API
   * @param createCommentDto - 작성한 댓글 데이터
   */
  @ApiOperation({ summary: '댓글 작성시 사용하는 API' })
  @ApiCreatedResponse({
    description: '댓글 작성 성공시 댓글 ID 반환',
    schema: { properties: { commentId: { example: 1 } } },
  })
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
  @ApiOperation({ summary: '댓글 수정시 사용하는 API' })
  @ApiNoContentResponse({ description: '댓글 수정 성공시' })
  @ApiNotFoundResponse({
    description: '수정할려고 하는 댓글이 없을경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'comment_not_found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '댓글 수정을 요청한 사용자와 실제 작성자가 다를경우',
    schema: {
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
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
  @ApiOperation({ summary: '댓글을 삭제할때 사용하는 API' })
  @ApiNoContentResponse({ description: '정상적으로 댓글이 삭제된 경우' })
  @ApiNotFoundResponse({
    description: '삭제를 요청한 댓글이 없을경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'comment_not_found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '삭제를 요청한 유저와 댓글 작성자가 일치하지 않은경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'comment_not_found' },
      },
    },
  })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  async remove(@Req() req, @Param('commentId', ParseIntPipe) commentId: number) {
    await this.commentsService.remove(req.user.userId, commentId);
  }
}
