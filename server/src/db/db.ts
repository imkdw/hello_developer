import { createConnection } from "typeorm";
import config from "../config";
import Post from "../entity/post.entity";
import Tag from "../entity/tag.entity";
import User from "../entity/user.entity";

export const connection = createConnection({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [User, Post, Tag],
  synchronize: true,
});
