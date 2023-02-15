import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

class UserController {
  static profile = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const profile = await UserService.profile(userId);
      res.status(200).json(profile);
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static addBookmark = async (req: Request, res: Response) => {
    const { postId } = req.body;
    const userId = res.locals.userId;

    try {
      await UserService.addBookmark(postId, userId);
      res.status(201).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static deleteBookmark = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = res.locals.userId;

    try {
      await UserService.deleteBookmark(postId, userId);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static history = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const item = req.query.item as string;

    try {
      const history = await UserService.history(userId, item);
      res.status(200).json(history);
    } catch (err: any) {
      console.error(err.message);
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };
}

export default UserController;
