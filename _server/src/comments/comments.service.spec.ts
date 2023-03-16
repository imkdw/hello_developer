import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repostiroy';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('[Service] CommentsService', () => {
  let commentsService: CommentsService;
  let commentRepository: CommentRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        CommentRepository,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  describe('[댓글작성] CommentsService.create()', () => {
    it('정상적인 댓글 작성', async () => {
      // given
      const userId = 'user-id-1';
      const createCommentDto: CreateCommentDto = {
        boardId: 'board-id-1',
        comment: 'comment',
      };
      const createdComment = new Comment();
      createdComment.commentId = 1;

      // when
      const commentRepoSpy = jest
        .spyOn(commentRepository, 'create')
        .mockResolvedValue(createdComment);
      const result = await commentsService.create(userId, createCommentDto);

      // then
      expect(commentRepoSpy).toBeCalledWith(
        createCommentDto.boardId,
        userId,
        createCommentDto.comment,
      );
      expect(result).toEqual(1);
    });
  });

  describe('[댓글수정] CommentsService.update()', () => {
    it('댓글을 찾을 수 없을때, 404, comment_not_found', async () => {
      // given
      const userId = 'user-id-1';
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = {
        comment: 'update-comment',
      };

      // when
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(null);
      try {
        await commentsService.update(userId, commentId, updateCommentDto);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('comment_not_found');
      }
    });

    it('댓글 작성자와, 업데이트 요청자의 아이디가 일치하지 않을때, 401, unauthorized_user', async () => {
      // given
      const userId = 'user-id-1';
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = { comment: 'update-comment' };
      const user = new User();
      user.userId = 'user-id-2';
      const comment = new Comment();
      comment.user = user;

      // when
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      try {
        await commentsService.update(userId, commentId, updateCommentDto);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('unauthorized_user');
      }
    });

    it('댓글 정상 수정', async () => {
      // given
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = { comment: 'update-comment' };

      const user = new User();
      user.userId = 'user-id-1';

      const comment = new Comment();
      comment.user = user;

      // when
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      const commentRepoSpy = jest.spyOn(commentRepository, 'update');
      await commentsService.update(user.userId, commentId, updateCommentDto);

      // then
      expect(commentRepoSpy).toBeCalledWith(user.userId, commentId, updateCommentDto.comment);
    });
  });

  describe('[댓글 삭제] CommentsService.remove()', () => {
    it('댓글을 찾을 수 없을때, 404, comment_not_found', async () => {
      // given
      const userId = 'user-id-1';
      const commentId = 1;

      // when
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(null);
      try {
        await commentsService.remove(userId, commentId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('comment_not_found');
      }
    });

    it('댓글 작성자와, 삭제 요청자의 아이디가 일치하지 않을때, 401, unauthorized_user', async () => {
      // given
      const userId = 'user-id-1';
      const commentId = 1;

      const user = new User();
      user.userId = 'user-id-2';
      const comment = new Comment();
      comment.user = user;

      // when
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      try {
        await commentsService.remove(userId, commentId);
      } catch (err: any) {
        // then
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('unauthorized_user');
      }
    });

    it('댓글 정상 삭제', async () => {
      // given
      const userId = 'user-id-1';
      const commentId = 1;

      const user = new User();
      user.userId = 'user-id-1';
      const comment = new Comment();
      comment.user = user;

      // when
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      const commentRepoSpy = jest.spyOn(commentRepository, 'remove');
      await commentsService.remove(userId, commentId);

      // then
      expect(commentRepoSpy).toBeCalledWith(userId, commentId);
    });
  });
});
