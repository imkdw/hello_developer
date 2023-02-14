import express from "express";
import PostController from "../controllers/post.controller";
import { isAuth } from "../middlewares/isAuth";

const postRouter = express.Router();

/** 게시글 추가 */
postRouter.post("/add", isAuth, PostController.add);

/** 게시글 목록 가져오기 */
postRouter.get("/list", PostController.list);

/** 게시글 상세보기 */
postRouter.get("/:postId", PostController.detail);

/** 댓글 추가 */
postRouter.post("/comment/add", isAuth, PostController.addComment);

/** 대댓글 추가 */
postRouter.post("/re-comment/add", isAuth, PostController.addReComment);

export default postRouter;
