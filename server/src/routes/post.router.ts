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

/** 게시글 삭제 */
postRouter.delete("/:postId", isAuth, PostController.deletePost);

/** 게시글 수정 */
postRouter.put("/:postId", isAuth, PostController.updatePost);

/** 댓글 추가 */
postRouter.post("/comment/add", isAuth, PostController.addComment);

/** 댓글 삭제 */
postRouter.delete("/comment/:commentId", isAuth, PostController.deleteComment);

/** 댓글 수정 */
postRouter.put("/comment/:commentId", isAuth, PostController.updateComment);

/** 대댓글 추가 */
postRouter.post("/re-comment/add", isAuth, PostController.addReComment);

/** 대댓글 삭제 */
postRouter.delete("/re-comment/:reCommentId", isAuth, PostController.deleteReComment);

/** 댓글 수정 */
postRouter.put("/re-comment/:reCommentId", isAuth, PostController.updateReComment);

/** 게시글 추천 추가/삭제*/
postRouter.post("/:postId/recommend", isAuth, PostController.recommedation);

/** 게시글 추천수 증가 */
postRouter.patch("/:postId/views", PostController.views);

export default postRouter;
