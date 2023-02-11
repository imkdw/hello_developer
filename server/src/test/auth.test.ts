import request from "supertest";
import { createConnection } from "typeorm";
import app from "../app";
import { connection } from "../db/db";
import User from "../entity/user.entity";
import Secure from "../utils/secure";

/**
 * 회원가입 API 테스트 케이스
 * 1. 형식이 올바른 경우
 * 2. 이메일 형식이 잘못된 경우
 * 3. 이메일이 비어있는 경우
 * 4. 비밀번호 형식이 잘못된 경우
 * 5. 비밀번호가 비어있는 경우
 * 6. 닉네임 형식이 잘못된 경우
 * 7. 닉네임이 비어있는 경우
 * 8. 이메일이 중복된 경우
 * 9. 닉네임이 중복된 경우
 */

describe("[POST] /auth/register", () => {
  /** 테스트 전 모든 데이터 초기화 */
  beforeAll(async () => {
    const repo = (await connection).getRepository(User);
    await repo.query("TRUNCATE TABLE user");
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const repo = (await connection).getRepository(User);
    await repo.query("TRUNCATE TABLE user");
  });

  test("정상 회원가입", async () => {
    const account = {
      email: "test@test.com",
      password: "test1234!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(201);
  });

  test("이메일 : 잘못된 형식", async () => {
    const account = {
      email: "testtest.com",
      password: "test1234!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-001", message: "invalid_email" });
  });

  test("이메일 : 입력값 없음", async () => {
    const account = {
      email: "",
      password: "test1234!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-001", message: "invalid_email" });
  });

  test("이메일 : 중복", async () => {
    const account = {
      email: "test@test.com",
      password: "test1234!@#",
      nickname: "test99",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-004", message: "exist_email" });
  });

  test("비밀번호 : 잘못된 형식", async () => {
    const account = {
      email: "test@test.com",
      password: "test1234",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-002", message: "invalid_password" });
  });

  test("비밀번호 : 입력값 없음", async () => {
    const account = {
      email: "test@test.com",
      password: "",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-002", message: "invalid_password" });
  });

  test("닉네임 : 잘못된 형식", async () => {
    const account = {
      email: "test@test.com",
      password: "test1234!@#",
      nickname: "test1!!",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-003", message: "invalid_nickname" });
  });

  test("닉네임 : 입력값 없음", async () => {
    const account = {
      email: "test@test.com",
      password: "test1234!@#",
      nickname: "test1!!",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-003", message: "invalid_nickname" });
  });

  test("닉네임 : 중복", async () => {
    const account = {
      email: "test999@test.com",
      password: "test1234!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-005", message: "exist_nickname" });
  });
});

describe("[POST] /auth/login", () => {
  /** 테스트 전 임시유저 생성 */
  beforeAll(async () => {
    const repo = (await connection).getRepository(User);
    const user = repo.create({
      email: "test@test.com",
      password: await Secure.encryptToHash("test123!@#"),
      nickname: "테스트계정1",
    });
    await repo.save(user);
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const repo = (await connection).getRepository(User);
    await repo.query("TRUNCATE TABLE user");
    (await connection).close();
  });

  test("정상 로그인", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#",
    };

    const res = await request(app).post("/auth/login").send(account);
    expect(res.statusCode).toBe(200);

    /** 반환값 : { accessToken: string } */
    const { accessToken } = res.body;
    expect(accessToken.length).toBeGreaterThan(1);
  });

  test("이메일 없음", async () => {
    const account = {
      email: "test1@test.com",
      password: "test123!@#",
    };

    const res = await request(app).post("/auth/login").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-006", message: "invalid_email_or_password" });
  });

  test("비밀번호 불일치", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#!",
    };

    const res = await request(app).post("/auth/login").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-006", message: "invalid_email_or_password" });
  });
});
