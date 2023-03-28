declare namespace NodeJS {
  export interface ProcessEnv {
    /** DB */
    DATABASE_TYPE: 'mysql';
    DATABASE_PORT: number;

    /** JWT */
    JWT_SECRET_KEY: string;

    // AWS
    AWS_ACCESS_KEY: string;
    AWS_SECRET_ACCESS_KEY: string;

    // BCRYPT
    BCRYPT_SALT: number;
  }
}
