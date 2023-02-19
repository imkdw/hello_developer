import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";
import postRouter from "./routes/post.router";
import userRouter from "./routes/user.router";

dotenv.config();

const app = express();
app.set("port", process.env.PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

/** CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH ,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/** Routers */
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/post", postRouter);
app.use("/v1/api/user", userRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
