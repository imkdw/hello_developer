import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { AddPostUserDTO } from "../types/post";

class PostController {
  static add = async (req: Request, res: Response) => {
    const userDTO: AddPostUserDTO = req.body;

    try {
      await PostService.add(res.locals.userId, userDTO);
      res.status(201).json({ message: "Create Post Success" });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };
}

export default PostController;
