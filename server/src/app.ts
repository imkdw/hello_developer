import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";
import postRouter from "./routes/post.router";
import userRouter from "./routes/user.router";
import Jwt from "./utils/jwt";

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
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYTU4MzI2ZS1lODQ0LTQ1MWEtODQ0Ny04Y2M1ZjlhNDdhNzIiLCJlbWFpbCI6Imlta2R3QGtha2FvLmNvbSIsIm5pY2tuYW1lIjoi64-Z7JqwIiwiaWF0IjoxNjc2ODkxNTU1LCJleHAiOjE2NzY4OTUxNTV9.4NY0gNWiLmUMdFU8I8rb3B03TbJFDip83r0-wchZRuw";
  try {
    const decodedToken = Jwt.decode(token);
    console.log(decodedToken);
  } catch (err: any) {
    console.error(err.message);
  }
  res.status(200).json({ status: "OK" });
});

export default app;
