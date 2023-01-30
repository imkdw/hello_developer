import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set("port", process.env.PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(app.get("port"), () => {
  console.log(`Server Listening on ${app.get("port")}`);
});
