import { createConnection } from "typeorm";
import config from "../config";
import User from "../entity/user.entity";

export const connection = createConnection({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [User],
  synchronize: true,
});
