declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_TYPE: "mysql";
    DATABASE_PORT: number;
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
  }
}
