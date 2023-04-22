export default () => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    atkExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    rtkExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  bcrypt: {
    salt: process.env.BCRYPT_SALT,
  },
  nodemailer: {
    user: process.env.GMAIL_OAUTH_USER,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  slack: {
    token: process.env.SLACK_TOKEN,
    logChannelId: process.env.SLACK_LOG_CHANNEL_ID,
  },
});
