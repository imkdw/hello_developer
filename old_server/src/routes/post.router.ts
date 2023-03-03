import express from "express";
import PostController from "../controllers/post.controller";
import { isAuth } from "../middlewares/isAuth";
import { PostValidator } from "../validators/post.validator";

const postRouter = express.Router();

// TODO: 게시글 추가시 내용 검증로직 추가필요
/** 게시글 추가 */
postRouter.post("/add", isAuth, PostValidator.add, PostController.add);

/** 게시글 목록 가져오기 */
postRouter.get("/list", PostController.list);

/** 게시글 상세보기 */
postRouter.get("/:postId", PostController.detail);

/** 게시글 삭제 */
postRouter.delete("/:postId", isAuth, PostController.deletePost);

/** 게시글 수정 */
postRouter.put("/:postId", isAuth, PostValidator.add, PostController.updatePost);

/** 댓글 추가 */
postRouter.post("/comment/add", isAuth, PostValidator.comment, PostController.addComment);

/** 댓글 삭제 */
postRouter.delete("/comment/:commentId", isAuth, PostController.deleteComment);

/** 댓글 수정 */
postRouter.put("/comment/:commentId", isAuth, PostValidator.comment, PostController.updateComment);

/** 대댓글 추가 */
postRouter.post("/re-comment/add", isAuth, PostValidator.reComment, PostController.addReComment);

/** 대댓글 삭제 */
postRouter.delete("/re-comment/:reCommentId", isAuth, PostController.deleteReComment);

/** 대댓글 수정 */
postRouter.put("/re-comment/:reCommentId", isAuth, PostValidator.reComment, PostController.updateReComment);

/** 게시글 추천 추가*/
postRouter.patch("/recommend/:postId", isAuth, PostController.addRecommend);

/** 게시글 추천 삭제*/
postRouter.delete("/recommend/:postId", isAuth, PostController.deleteRecommend);

/** 게시글 추천수 증가 */
postRouter.patch("/:postId/views", PostController.views);

/** 게시글에 대한 유저의 활동내역(북마크, 추천) 가져오기 */
postRouter.get("/:postId/user", isAuth, PostController.postUserActivity);

export default postRouter;
