import express from "express";
import PostController from "../controllers/post.controller";
import { isAuth } from "../middlewares/isAuth";

const postRouter = express.Router();

postRouter.post("/add", isAuth, PostController.add);

export default postRouter;
