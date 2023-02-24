import dotenv from "dotenv";

dotenv.config();

export default {
  database: {
    type: process.env.DATABASE_TYPE,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    atkExpiresIn: process.env.JWT_ATK_EXPIRES_IN,
    rtkExpiresIn: process.env.JWT_RTK_EXPIRES_IN,
  },
  mailer: {
    gmailUser: process.env.GMAIL_OAUTH_USER,
    gmailClientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    gmailClientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
    gmailRefreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
};
