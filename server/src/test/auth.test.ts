import request from "supertest";
import app from "../app";
import { pool } from "../db/db";

const LOGIN_API = "/v1/api/auth/login";
const REGISTER_API = "/v1/api/auth/admin-register";
const EMAIL = "test@test.com";
const PASSWORD = "test123!@#";
const NICKNAME = "test11";

const register = async () => {
  const res = await request(app)
    .post(REGISTER_API)
    .send({ email: EMAIL, password: PASSWORD, nickname: NICKNAME });

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
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables()");
    connection.destroy();
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
    expect(res.body).toEqual({ code: "auth-001", message: "invalid_email" });
  });

  test("[중복된 이메일] HTTP 400, CODE: 'auth-004', MESSAGE: 'exist_email'", async () => {
    const account = {
      email: EMAIL,
      password: PASSWORD,
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-004", message: "exist_email" });
  });

  test("[유효하지 않은 비밀번호] HTTP 400, CODE: 'auth-002', MESSAGE: 'invalid_password'", async () => {
    const account = {
      email: EMAIL,
      password: "test123",
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-002", message: "invalid_password" });
  });

  test("[유효하지 않은 닉네임] HTTP 400, CODE: 'auth-003', MESSAGE: 'invalid_nickname'", async () => {
    const account = {
      email: EMAIL,
      password: PASSWORD,
      nickname: "test1!!",
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-003", message: "invalid_nickname" });
  });

  test("[중복된 닉네임] HTTP 400, CODE: 'auth-005', MESSAGE: 'exist_nickname'", async () => {
    const account = {
      email: "test123@test.com",
      password: PASSWORD,
      nickname: NICKNAME,
    };

    const res = await request(app).post(REGISTER_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-005", message: "exist_nickname" });
  });
});

describe("로그인 API, [POST] /v1/api/auth/register", () => {
  beforeAll(async () => {
    await register();
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상적인 닉네임] HTTP 200, 엑세스토큰 반환", async () => {
    const account = { email: EMAIL, password: PASSWORD };

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("[이메일 확인불가] HTTP 400, CODE: 'auth-006', MESSAGE: 'invalid_email_or_password'", async () => {
    const account = {
      email: "test1@test.com",
      password: PASSWORD,
    };

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-006", message: "invalid_email_or_password" });
  });

  test("[잘못된 비밀번호] HTTP 400, CODE: 'auth-006', MESSAGE: 'invalid_email_or_password'", async () => {
    const account = {
      email: EMAIL,
      password: "test123!@#!",
    };

    const res = await request(app).post(LOGIN_API).send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-006", message: "invalid_email_or_password" });
  });
});
