import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";

dotenv.config();

const app = express();
app.set("port", process.env.PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

/** Routers */
app.use("/auth", authRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
