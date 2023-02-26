import express from "express";
import UserController from "../controllers/user.controller";
import { isAuth } from "../middlewares/isAuth";
import { UserValidator } from "../validators/user.validator";

const userRouter = express.Router();

/** 프로필 가져오기 */
userRouter.get("/:userId", UserController.profile);

/** 프로필 수정 */
userRouter.put("/:userId", isAuth, UserValidator.profile, UserController.updateProfile);

/** 히스토리 가져오기 */
userRouter.get("/:userId/history", UserController.history);

/** 게시글 북마크 추가하기 */
userRouter.post("/bookmark", isAuth, UserController.addBookmark);

/** 게시글 북마크 삭제하기 */
userRouter.delete("/bookmark/:postId", isAuth, UserController.deleteBookmark);

/** 회원탈퇴 */
userRouter.post("/exit", isAuth, UserController.exit);

export default userRouter;
