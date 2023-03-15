import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repostiroy';
import { CommentsController } from './comments.controller';
import { CommentsModule } from './comments.module';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('[Controller] CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;
  let commentRepository: CommentRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CommentsController],
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

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  describe('[댓글작성] CommentsController.create()', () => {
    it('정상적인 댓글 작성시 commentsService.create() 호출', async () => {
      // given
      const req = { user: { userId: 'user-id-1' } };
      const createCommentDto: CreateCommentDto = {
        boardId: 'board-id-1',
        comment: 'comment',
      };
      const comment = new Comment();
      comment.commentId = 1;

      // when
      const commentsServiceSpy = jest.spyOn(commentsService, 'create');
      jest.spyOn(commentRepository, 'create').mockResolvedValue(comment);
      const result = await commentsController.create(req, createCommentDto);

      // then
      expect(commentsServiceSpy).toBeCalledWith(req.user.userId, createCommentDto);
      expect(result.commentId).toEqual(1);
    });
  });

  describe('[댓글수정] CommentsController.update()', () => {
    it('정상적인 댓글 수정시 CommentsService.update() 호출', async () => {
      // given
      const req = { user: { userId: 'user-id-1' } };
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = {
        comment: 'update-comment',
      };
      const user = new User();
      user.userId = 'user-id-1';
      const comment = new Comment();
      comment.user = user;

      // when
      const commentsServiceSpy = jest.spyOn(commentsService, 'update');
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      await commentsController.update(req, commentId, updateCommentDto);

      // then
      expect(commentsServiceSpy).toBeCalledWith(req.user.userId, commentId, updateCommentDto);
    });
  });

  describe('[댓글삭제] CommentsController.delete()', () => {
    it('정상적인 댓글 삭제시 CommentsService.delete() 호출', async () => {
      // given
      const req = { user: { userId: 'user-id-1' } };
      const commentId = 1;
      const user = new User();
      user.userId = 'user-id-1';
      const comment = new Comment();
      comment.user = user;

      // when
      const commentsServiceSpy = jest.spyOn(commentsService, 'remove');
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      await commentsController.remove(req, commentId);

      // then
      expect(commentsServiceSpy).toBeCalledWith(req.user.userId, commentId);
    });
  });
});
