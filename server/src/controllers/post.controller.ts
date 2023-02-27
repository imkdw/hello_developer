import { NextFunction, Request, Response } from "express";
import { PostService } from "../services/post.service";
import { AddPostUserDTO, UpdatePostUserDTO } from "../types/post";

class PostController {
  /**
   * 게시글 추가 컨트롤러
   * @returns {postId} - 추가된 게시글 아이디를 반환(테스트용)
   */
  static add = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: AddPostUserDTO = req.body;

    try {
      const postId = await PostService.add(res.locals.userId, userDTO);
      res.status(201).json({ postId });
    } catch (err: any) {
      next(err);
    }
  };

  static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category1 = (req.query.category1 || "") as string;
      const category2 = (req.query.category2 || "") as string;

      const posts = await PostService.list(category1, category2);
      res.status(200).json(posts);
    } catch (err: any) {
      next(err);
    }
  };

  static detail = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    try {
      const post = await PostService.detail(postId);
      res.status(200).json(post);
    } catch (err: any) {
      next(err);
    }
  };

  static addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, comment } = req.body;
      const userId = res.locals.userId;

      const commentId = await PostService.addComment(userId, postId, comment);
      res.status(201).json({ commentId });
    } catch (err: any) {
      next(err);
    }
  };

  static addReComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId, reComment } = req.body;
      const userId = res.locals.userId;

      const reCommentId = await PostService.addRecomment(userId, commentId, reComment);
      res.status(201).json({ reCommentId });
    } catch (err: any) {
      next(err);
    }
  };

  static deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = res.locals.userId;

    try {
      await PostService.deletePost(userId, postId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = Number(req.params.commentId);
    const userId = res.locals.userId;

    try {
      await PostService.deleteComment(userId, commentId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static deleteReComment = async (req: Request, res: Response, next: NextFunction) => {
    const reCommentId = Number(req.params.reCommentId);
    const userId = res.locals.userId;

    try {
      await PostService.deleteReComment(userId, reCommentId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static recommedation = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = res.locals.userId;

    try {
      await PostService.recommedation(userId, postId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static views = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    try {
      await PostService.views(postId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static updateComment = async (req: Request, res: Response, next: NextFunction) => {
    const { comment } = req.body;
    const { commentId } = req.params;

    try {
      await PostService.updateComment(commentId, comment);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static updateReComment = async (req: Request, res: Response, next: NextFunction) => {
    const { reComment } = req.body;
    const { reCommentId } = req.params;

    try {
      await PostService.updateReComment(reCommentId, reComment);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: UpdatePostUserDTO = req.body;
    const userId = res.locals.userId;
    const postId = req.params.postId;

    try {
      await PostService.updatePost(userId, postId, userDTO);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };
}

export default PostController;
