import { pool } from "../db/db";
import Secure from "../utils/secure";
import request from "supertest";
import app from "../app";

describe("[POST] /post/add", () => {
  let accessToken: string;
  beforeAll(async () => {
    const email = "test@test.com";
    const password = "test123!@#";
    const nickname = "test1";

    /** 회원가입 */
    const connection = await pool.getConnection();
    const userId = Secure.getUUID();
    const hashedPassword = await Secure.encryptToHash(password);
    const query = "INSERT INTO user(user_id, email, password, nickname) VALUES(?, ?, ?, ?)";
    const values = [userId, email, hashedPassword, nickname];
    await connection.execute(query, values);
    connection.destroy();

    /** 로그인 및 accessToken 저장 */
    const res = await request(app).post("/auth/login").send({ email, password });
    accessToken = res.body.accessToken;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("set foreign_key_checks=0");
    await connection.execute("TRUNCATE post_tags");
    await connection.execute("TRUNCATE tags");
    await connection.execute("TRUNCATE post_views");
    await connection.execute("TRUNCATE post");
    await connection.execute("TRUNCATE user");
    await connection.execute("set foreign_key_checks=1");
    connection.destroy();
  });

  test("return http 201 when provided one category", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "notice",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post("/post/add")
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });

  test("return http 400 and code: 'post-001' when provided not exist category", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "test",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post("/post/add")
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-001", message: "unknown_category" });
  });

  test("return http 201 when provided two category", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-tech",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post("/post/add")
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });

  test("return http 400 when provided have category#1 but no have category#2", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-test",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post("/post/add")
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-001", message: "unknown_category" });
  });

  test("return http 201 when provided no hashtag", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-tech",
      tags: [],
    };

    const res = await request(app)
      .post("/post/add")
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });

  test("return http 201 when provided three hashtag", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-tech",
      tags: [{ name: "jest" }, { name: "typescript" }, { name: "express.js" }],
    };

    const res = await request(app)
      .post("/post/add")
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });
});
