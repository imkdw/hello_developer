import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UpdateProfileUserDTO } from "../types/user";

class UserController {
  /**
   * 사용자 프로필을 가져오는 컨트롤러
   */
  static profile = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const profile = await UserService.profile(userId);
      res.status(200).json(profile);
    } catch (err: any) {
      next(err);
    }
  };

  static addBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const userId = res.locals.userId;

    try {
      await UserService.addBookmark(postId, userId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static deleteBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const userId = res.locals.userId;

    try {
      await UserService.deleteBookmark(postId, userId);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static history = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const item = req.query.item as "post" | "comment" | "bookmark";

    try {
      const history = await UserService.history(userId, item);
      res.status(200).json(history);
    } catch (err: any) {
      next(err);
    }
  };

  static updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const userDTO: UpdateProfileUserDTO = req.body;
    const tokenUserId = res.locals.userId;

    try {
      await UserService.updateProfile(userId, tokenUserId, userDTO);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static exit = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.userId;
    const { password } = req.body;

    try {
      await UserService.exit(userId, password);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  static image = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.userId;
    const image = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    try {
      const imageUrl = await UserService.image(userId, image);
      res.status(200).json({ profileImg: imageUrl });
    } catch (err: any) {
      next(err);
    }
  };
}

export default UserController;
