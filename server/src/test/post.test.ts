import { pool } from "../db/db";
import Secure from "../utils/secure";
import request from "supertest";
import app from "../app";

describe("게시글 작성 API, [POST] /v1/api/post/add", () => {
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
    const res = await request(app).post("/v1/api/auth/login").send({ email, password });
    accessToken = res.body.accessToken;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  const addPostApi = "/v1/api/post/add";

  test("[카테고리가 1개인 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "notice",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post(addPostApi)
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });

  test("[존재하지 않는 카테고리로 게시글 작성] HTTP 400, CODE: 'post-001', MESSAGE: 'unknown_category'", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "test",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post(addPostApi)
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-001", message: "unknown_category" });
  });

  test("[카테고리가 2개인 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-tech",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post(addPostApi)
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });

  test("[첫번째 카테고리는 존재, 두번째는 존재하지않는 카테고리로 게시글 작성] HTTP 400, CODE: 'post-001', MESSAGE: 'unknown_category'", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-test",
      tags: [{ name: "jest" }],
    };

    const res = await request(app)
      .post(addPostApi)
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-001", message: "unknown_category" });
  });

  test("[해시태그 1개로 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-tech",
      tags: [],
    };

    const res = await request(app)
      .post(addPostApi)
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });

  test("[해시태그 3개로 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: "test title",
      content: "test content",
      category: "qna-tech",
      tags: [{ name: "jest" }, { name: "typescript" }, { name: "express.js" }],
    };

    const res = await request(app)
      .post(addPostApi)
      .send(postData)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(res.status).toBe(201);
  });
});

describe("게시글 목록 API, [GET] /v1/api/post/:category1?sub=?", () => {
  let token: string;

  const email = "test@test.com";
  const password = "test123!@#";
  const nickname = "test1";
  beforeAll(async () => {
    /** 1. 회원가입 진행 */
    const registeRes = await request(app).post("/v1/api/auth/register").send({ email, password, nickname });

    expect(registeRes.status).toBe(201);

    /** 2. 로그인 및 토큰 저장 */
    const loginRes = await request(app).post("/v1/api/auth/login").send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("accessToken");
    token = loginRes.body.accessToken;

    /** 3. 게시글 생성 */
    const createPostRes1 = await request(app)
      .post("/v1/api/post/add")
      .send({
        title: "test post title",
        content: "test post content",
        category: "notice",
        tags: [{ name: "tdd" }],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(createPostRes1.status).toBe(201);

    const createPostRes2 = await request(app)
      .post("/v1/api/post/add")
      .send({
        title: "test post title2",
        content: "test post content2",
        category: "qna-tech",
        tags: [{ name: "tdd" }],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(createPostRes2.status).toBe(201);
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("set foreign_key_checks=0");
    await connection.execute("CALL truncate_tables");
    await connection.execute("set foreign_key_checks=1");
    connection.destroy();
  });

  test("[카테고리가 1개인 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get("/v1/api/post/notice");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[카테고리가 2개인 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get("/v1/api/post/qna?sub=tech");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[첫번째 카테고리는 정상, 서브 카테고리는 없는 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get("/v1/api/post/qna?sub=test");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[이상한 카테고리로 게시글 조회 요청시] HTTP 400, CODE: 'post-002', MESSAGE: 'unknown_category'", async () => {
    const res = await request(app).get("/v1/api/post/test?sub=test");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-002", message: "unknown_category" });
  });
});

describe("댓글 작성 API, [POST] /v1/api/commend/add", () => {});

// http://localhost:5000/v1/api/comment/add, {postId: ..., commentText: ...}, {'Autho': Bearer aaa}
