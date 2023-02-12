import request from "supertest";
import app from "../app";
import { pool } from "../db/db";
import Secure from "../utils/secure";

describe("[POST] /auth/register", () => {
  beforeAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("TRUNCATE user");
    connection.destroy();
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("TRUNCATE user");
    connection.destroy();
  });

  test("return http 200 status and token when provided with valid account", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(201);
  });

  test("return http 400 and code: 'auth-001' when provided invalid email", async () => {
    const account = {
      email: "testtest.com",
      password: "test123!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-001", message: "invalid_email" });
  });

  test("return http 400 and code: 'auth-004' when provided duplicate email", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test99",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-004", message: "exist_email" });
  });

  test("return http 400 and code: 'auth-002' when provided invalid password", async () => {
    const account = {
      email: "test@test.com",
      password: "test1234",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-002", message: "invalid_password" });
  });

  test("return http 400 and code: 'auth-002' when provided invalid nickname", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test1!!",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-003", message: "invalid_nickname" });
  });

  test("return http 400 and code: 'auth-005' when provided duplicate nickname", async () => {
    const account = {
      email: "test999@test.com",
      password: "test123!@#",
      nickname: "test1",
    };

    const res = await request(app).post("/auth/register").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-005", message: "exist_nickname" });
  });
});

describe("[POST] /auth/login", () => {
  beforeAll(async () => {
    const connection = await pool.getConnection();
    const userId = Secure.getUUID();
    const password = await Secure.encryptToHash("test123!@#");
    const query = "INSERT INTO user(user_id, email, password, nickname) VALUES(?, ?, ?, ?)";
    const values = [userId, "test@test.com", password, "test1"];
    await connection.execute(query, values);
    connection.destroy();
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("TRUNCATE user");
    connection.destroy();
  });

  test("return http 200 and accessToken when provided valid account", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#",
    };

    const res = await request(app).post("/auth/login").send(account);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("return http 400 and code: 'auth-006' when provided wrong email", async () => {
    const account = {
      email: "test1@test.com",
      password: "test123!@#",
    };

    const res = await request(app).post("/auth/login").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-006", message: "invalid_email_or_password" });
  });

  test("return http 400 and code: 'auth-006' when provided wrong password", async () => {
    const account = {
      email: "test@test.com",
      password: "test123!@#!",
    };

    const res = await request(app).post("/auth/login").send(account);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ code: "auth-006", message: "invalid_email_or_password" });
  });
});
