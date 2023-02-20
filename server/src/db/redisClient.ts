import { createClient } from "redis";

export const redisConnection = async () => {
  const redisClient = createClient();
  redisClient.on("error", (err: any) => console.error(err));

  return redisClient;
};
