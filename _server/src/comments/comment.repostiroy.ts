import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createComment } from 'test/common';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentRepository {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {}

  /**
   * 댓글 작성
   * @param boardId - 댓글을 작성할 게시글 아이디
   * @param userId  - 댓글을 작성할 유저 아이디
   * @param content - 댓글 내용
   */
  async create(boardId: string, userId: string, comment: string): Promise<Comment> {
    return await this.commentRepository.save({ boardId, userId, comment });
  }

  /**
   * 댓글 수정
   * @param userId - 댓글 작성자의 아이디
   * @param commentId - 댓글 아이디
   * @param comment - 댓글 수정 데이터
   */
  async update(userId: string, commentId: number, comment: string) {
    await this.commentRepository.update({ userId, commentId }, { comment });
  }

  /**
   *
   */
  async remove(userId: string, commentId: number) {
    await this.commentRepository.delete({ userId, commentId });
  }

  /**
   * 댓글 가져오기
   * @param commentId - 댓글 아이디
   */
  async findOne(commentId: number) {
    return await this.commentRepository.findOne({ where: { commentId } });
  }
}
