import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";
import postRouter from "./routes/post.router";
import userRouter from "./routes/user.router";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import config from "./config";

dotenv.config();

const app = express();
app.set("port", process.env.PORT);

/** 에러 로깅을 위한 센트리 초기화 */
Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

// 로그인시 사용되는 토큰을 저장하는 저장공간
// TODO: 전역 변수에서 redis로 저장공간 이관 필요
app.set("tokens", {});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(morgan("dev"));

/** CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH ,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, baggage, sentry-trace");
  next();
});

app.use("/v1/api/auth", authRouter);
app.use("/v1/api/post", postRouter);
app.use("/v1/api/user", userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 500 || !err.status) {
    Sentry.captureException(err);
    console.error(err);
  }

  res.status(err.status).json({
    status: err.status || 500,
    message: err.message || "",
    description: err.description || "",
    data: {
      action: err.data.action || "",
      parameter: err.data.parameter || "",
      message: err.data.message || "",
    },
  });
});

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
