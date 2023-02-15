import express from "express";
import UserController from "../controllers/user.controller";
import { isAuth } from "../middlewares/isAuth";

const userRouter = express.Router();

/** 프로필 가져오기 */
userRouter.get("/:userId", UserController.profile);

/** 히스토리 가져오기 */
userRouter.get("/:userId/history", UserController.history);

/** 게시글 북마크 추가하기 */
userRouter.post("/bookmark", isAuth, UserController.addBookmark);

/** 게시글 북마크 삭제하기 */
userRouter.delete("/bookmark/:postId", isAuth, UserController.deleteBookmark);

export default userRouter;
