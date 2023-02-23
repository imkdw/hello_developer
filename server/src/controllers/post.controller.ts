import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { AddPostUserDTO, UpdatePostUserDTO } from "../types/post";

class PostController {
  static add = async (req: Request, res: Response) => {
    const userDTO: AddPostUserDTO = req.body;

    try {
      const postId = await PostService.add(res.locals.userId, userDTO);
      res.status(201).json({ postId });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static list = async (req: Request, res: Response) => {
    try {
      const category1 = (req.query.category1 || "") as string;
      const category2 = (req.query.category2 || "") as string;

      const posts = await PostService.list(category1, category2);
      res.status(200).json(posts);
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static detail = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      const post = await PostService.detail(postId);
      res.status(200).json(post);
    } catch (err: any) {
      console.error(err);
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static addComment = async (req: Request, res: Response) => {
    try {
      const { postId, comment } = req.body;
      const userId = res.locals.userId;

      const commentId = await PostService.addComment(userId, postId, comment);
      res.status(201).json({ commentId });
    } catch (err: any) {
      console.error(err);
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static addReComment = async (req: Request, res: Response) => {
    try {
      const { commentId, reComment } = req.body;
      const userId = res.locals.userId;

      const reCommentId = await PostService.addRecomment(userId, commentId, reComment);
      res.status(201).json({ reCommentId });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static deletePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = res.locals.userId;

    try {
      await PostService.deletePost(userId, postId);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static deleteComment = async (req: Request, res: Response) => {
    const commentId = Number(req.params.commentId);
    const userId = res.locals.userId;

    try {
      await PostService.deleteComment(userId, commentId);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static deleteReComment = async (req: Request, res: Response) => {
    const reCommentId = Number(req.params.reCommentId);
    const userId = res.locals.userId;

    try {
      await PostService.deleteReComment(userId, reCommentId);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static recommedation = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = res.locals.userId;

    try {
      await PostService.recommedation(userId, postId);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static views = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      await PostService.views(postId);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static updateComment = async (req: Request, res: Response) => {
    const { commentText } = req.body;
    const { commentId } = req.params;

    try {
      await PostService.updateComment(commentId, commentText);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static updateReComment = async (req: Request, res: Response) => {
    const { reCommentText } = req.body;
    const { reCommentId } = req.params;

    try {
      await PostService.updateReComment(reCommentId, reCommentText);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static updatePost = async (req: Request, res: Response) => {
    const userDTO: UpdatePostUserDTO = req.body;
    const userId = res.locals.userId;
    const postId = req.params.postId;

    try {
      await PostService.updatePost(userId, postId, userDTO);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };
}

export default PostController;
