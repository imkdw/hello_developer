import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentRepository } from './comment.repostiroy';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentRepository) {}

  /**
   * 댓글 작성
   * @param userId - 작성한 유저 아이디
   * @param createCommentDto - 댓글내용 및 게시글 아이디
   */
  async create(userId: string, createCommentDto: CreateCommentDto) {
    const { boardId, comment } = createCommentDto;

    const createdComment = await this.commentRepository.create(boardId, userId, comment);

    return createdComment.commentId;
  }

  /**
   * 댓글 수정
   * @param userId - 댓글 작성자의 아이디
   * @param commentId - 댓글 아이디
   * @param updateCommentDto - 댓글 수정 데이터
   */
  async update(userId: string, commentId: number, updateCommentDto: UpdateCommentDto) {
    const existComment = await this.commentRepository.findOne(commentId);

    if (!existComment) {
      throw new NotFoundException('comment_not_found');
    }

    if (existComment.userId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    const { comment } = updateCommentDto;
    await this.commentRepository.update(userId, commentId, comment);
  }

  /**
   * 댓글 삭제
   * @param userId - 삭제 요청자의 아이디
   * @param commentId - 삭제 요청한 댓글의 아이디
   */
  async remove(userId: string, commentId: number) {
    const existComment = await this.commentRepository.findOne(commentId);

    if (!existComment) {
      throw new NotFoundException('comment_not_found');
    }

    if (existComment.userId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.commentRepository.remove(userId, commentId);
  }
}
