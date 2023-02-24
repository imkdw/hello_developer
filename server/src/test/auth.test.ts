import request from "supertest";
import app from "../app";
import { pool } from "../db/db";

const LOGIN_API = "/v1/api/auth/login";
const REGISTER_API = "/v1/api/auth/admin-register";
const EMAIL = "test@test.com";
const PASSWORD = "test123!@#";
const NICKNAME = "test11";

const register = async () => {
  const res = await request(app).post(REGISTER_API).send({ email: EMAIL, password: PASSWORD, nickname: NICKNAME });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("userId");
};

const TEAR_DOWN = async () => {
  const connection = await pool.getConnection();
  await connection.execute("CALL truncate_tables");
  connection.destroy();
};

describe("회원가입 API, [POST] /v1/api/auth/register", () => {
  beforeAll(async () => {
    await TEAR_DOWN();
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상적인 회원가입] HTTP 201", async () => {
    const account = { email: EMAIL, password: PASSWORD, nickname: NICKNAME };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  test("[유효하지 않은 이메일] HTTP 400, CODE: 'auth-001', MESSAGE: 'invalid_email'", async () => {
    const account = {
      email: "testtest.com",
      password: PASSWORD,
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Email format is invalid",
      data: {
        action: "register",
        parameter: "testtest.com",
        message: "invalid_email",
      },
    });
  });

  test("[중복된 이메일] HTTP 400, CODE: 'auth-004', MESSAGE: 'exist_email'", async () => {
    const account = {
      email: EMAIL,
      password: PASSWORD,
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Email is already in use",
      data: {
        action: "register",
        parameter: EMAIL,
        message: "exist_email",
      },
    });
  });

  test("[유효하지 않은 비밀번호] HTTP 400, CODE: 'auth-002', MESSAGE: 'invalid_password'", async () => {
    const account = {
      email: EMAIL,
      password: "test123",
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Password format is invalid",
      data: {
        action: "register",
        parameter: "password",
        message: "invalid_password",
      },
    });
  });

  test("[유효하지 않은 닉네임] HTTP 400, CODE: 'auth-003', MESSAGE: 'invalid_nickname'", async () => {
    const account = {
      email: EMAIL,
      password: PASSWORD,
      nickname: "test1!!",
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Nickname format is invalid",
      data: {
        action: "register",
        parameter: "test1!!",
        message: "invalid_nickname",
      },
    });
  });

  test("[중복된 닉네임] HTTP 400, CODE: 'auth-005', MESSAGE: 'exist_nickname'", async () => {
    const account = {
      email: "test123@test.com",
      password: PASSWORD,
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Nickname is already in use",
      data: {
        action: "register",
        parameter: NICKNAME,
        message: "exist_nickname",
      },
    });
  });
});

describe(`로그인 API, [POST] ${LOGIN_API}`, () => {
  beforeAll(async () => {
    await register();
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상적인 로그인] HTTP 200, 엑세스토큰 반환", async () => {
    const account = { email: EMAIL, password: PASSWORD };

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("profileImg");
    expect(res.body).toHaveProperty("nickname");
  });

  test("[존재하지 않는 이메일] HTTP 400", async () => {
    const account = {
      email: "test1@test.com",
      password: PASSWORD,
    };

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.statusCode).toBe(400);
    console.log(res.body);

    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Email is do not exist or Password is invalid",
      data: {
        action: "login",
        parameter: "test1@test.com",
        message: "invalid_email_or_password",
      },
    });
  });

  test("[일치하지 않는 비밀번호] HTTP 400", async () => {
    const account = {
      email: EMAIL,
      password: "test123!@#!",
    };

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Bad Request",
      description: "Email is do not exist or Password is invalid",
      data: {
        action: "login",
        parameter: EMAIL,
        message: "invalid_email_or_password",
      },
    });
  });

  test("[인증되지 않은 유저], HTTP 400", async () => {
    await TEAR_DOWN();
    /** 미인증 상태로 회원가입 */
    const account = {
      email: EMAIL,
      password: PASSWORD,
      nickname: NICKNAME,
    };

    const registerRes = await request(app).post("/v1/api/auth/register").send(account);
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty("userId");

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.status);
  });
});
