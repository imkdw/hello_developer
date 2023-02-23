import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";
import postRouter from "./routes/post.router";
import userRouter from "./routes/user.router";

dotenv.config();

const app = express();
app.set("port", process.env.PORT);

// 로그인시 사용되는 토큰을 저장하는 저장공간
// TODO: 전역 변수에서 redis로 저장공간 이관 필요
app.set("tokens", {});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

/** CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH ,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/api/auth", authRouter);
app.use("/v1/api/post", postRouter);
app.use("/v1/api/user", userRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
