import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { AddPostUserDTO } from "../types/post";

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
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static addReComment = async (req: Request, res: Response) => {
    try {
      const { commentId, reComment } = req.body;
      const userId = res.locals.userId;

      await PostService.addRecomment(userId, commentId, reComment);
      res.status(201).json({ message: "Create ReComment Success" });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };
}

export default PostController;
