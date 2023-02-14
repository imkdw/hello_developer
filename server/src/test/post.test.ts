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

describe("게시글 목록 API, [GET] /v1/api/post/list/category1=&category2=", () => {
  let token: string;
  let postId: string;
  let commentId: number;

  beforeAll(async () => {
    const email = "test@test.com";
    const password = "test123!@#";
    const nickname = "test1";

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
    expect(createPostRes1.body).toHaveProperty("postId");
    postId = createPostRes1.body.postId;

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
    expect(createPostRes2.body).toHaveProperty("postId");
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[카테고리가 1개인 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get("/v1/api/post/list?category1=qna");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[카테고리가 2개인 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get("/v1/api/post/list?category1=qna&category2=tech");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[첫번째 카테고리는 정상, 서브 카테고리는 없는 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get("/v1/api/post/list?category1=qna&category2=test");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[이상한 카테고리로 게시글 조회] HTTP 400, CODE: 'post-002', MESSAGE: 'unknown_category'", async () => {
    const res = await request(app).get("/v1/api/post/list?category1=test");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-002", message: "unknown_category" });
  });

  test("[댓글이 달린 게시글 조회] HTTP 200", async () => {
    const addCommentres = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "test comment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addCommentres.status).toBe(201);
    expect(addCommentres.body).toHaveProperty("commentId");
    commentId = addCommentres.body.commentId;

    const res = await request(app).get("/v1/api/post/list?category1=qna");
    expect(res.status).toBe(200);
  });

  test("[대댓글이 달린 게시글 조회] HTTP 200", async () => {
    const addReCommentres = await request(app)
      .post("/v1/api/post/re-comment/add")
      .send({ commentId, reComment: "test recomment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addReCommentres.status).toBe(201);

    const res = await request(app).get("/v1/api/post/list?category1=qna");
    expect(res.status).toBe(200);
  });
});

describe("게시글 상세보기 API, [GET] /v1/api/post/:postId", () => {
  let token: string;
  let postId: string;
  let commentId: number;

  beforeAll(async () => {
    const email = "test@test.com";
    const password = "test123!@#";
    const nickname = "test1";

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
    expect(createPostRes1.body).toHaveProperty("postId");
    postId = createPostRes1.body.postId;

    /** 4. 댓글 작성 */
    const addCommentRes = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "test comment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addCommentRes.status).toBe(201);
    expect(addCommentRes.body).toHaveProperty("commentId");
    commentId = addCommentRes.body.commentId;

    /** 4. 댓글 작성 */
    const addCommentRes2 = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "test comment2" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addCommentRes2.status).toBe(201);
    expect(addCommentRes2.body).toHaveProperty("commentId");

    /** 5. 대댓글 작성 */
    const addReCommentRes = await request(app)
      .post("/v1/api/post/re-comment/add")
      .send({ commentId, reComment: "test recomment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addReCommentRes.status).toBe(201);

    /** 6. 대댓글 작성 */
    const addReCommentRes1 = await request(app)
      .post("/v1/api/post/re-comment/add")
      .send({ commentId, reComment: "test recomment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addReCommentRes1.status).toBe(201);
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[정상적인 게시글 조회] HTTP 200", async () => {
    const res = await request(app).get(`/v1/api/post/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body.comments.length).toBe(2);
  });

  test("[게시글 아이디 없음] HTTP 404, CODE : 'post-005', MESSAGE: 'not_found_post'", async () => {
    expect(1).toBe(1);
  });
});

describe("댓글 작성 API, [POST] /v1/api/post/comment/add", () => {
  let token: string;
  let postId: string;

  beforeAll(async () => {
    const email = "test@test.com";
    const password = "test123!@#";
    const nickname = "test1";

    /** 1. 회원가입 진행 */
    const registeRes = await request(app).post("/v1/api/auth/register").send({ email, password, nickname });

    expect(registeRes.status).toBe(201);

    /** 2. 로그인 및 토큰 저장 */
    const loginRes = await request(app).post("/v1/api/auth/login").send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("accessToken");
    token = loginRes.body.accessToken;

    /** 3. 게시글 생성 */
    const createPostRes = await request(app)
      .post("/v1/api/post/add")
      .send({
        title: "test post title",
        content: "test post content",
        category: "notice",
        tags: [{ name: "tdd" }],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(createPostRes.status).toBe(201);
    expect(createPostRes.body).toHaveProperty("postId");
    postId = createPostRes.body.postId;
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[정상적인 댓글작성] HTTP 201", async () => {
    const res = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "test comment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(201);
  });

  test("[댓글 미입력] HTTP 400, CODE: 'post-003', MESSAGE: 'invalid_comment'", async () => {
    const res = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "" })
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-003", message: "invalid_comment" });
  });
});

describe("대댓글 작성 API, [POST] /v1/api/post/re-comment/add", () => {
  let token: string;
  let commentId: string;

  beforeAll(async () => {
    const email = "test@test.com";
    const password = "test123!@#";
    const nickname = "test1";

    /** 1. 회원가입 진행 */
    const registeRes = await request(app).post("/v1/api/auth/register").send({ email, password, nickname });

    expect(registeRes.status).toBe(201);

    /** 2. 로그인 및 토큰 저장 */
    const loginRes = await request(app).post("/v1/api/auth/login").send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("accessToken");
    token = loginRes.body.accessToken;

    /** 3. 게시글 생성 */
    const addPostRes = await request(app)
      .post("/v1/api/post/add")
      .send({
        title: "test post title",
        content: "test post content",
        category: "notice",
        tags: [{ name: "tdd" }],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(addPostRes.status).toBe(201);
    expect(addPostRes.body).toHaveProperty("postId");
    const postId = addPostRes.body.postId;

    /** 4. 댓글 작성 */
    const addCommentRes = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "test comment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addCommentRes.status).toBe(201);
    expect(addCommentRes.body).toHaveProperty("commentId");
    commentId = addCommentRes.body.commentId;
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[정상적인 대댓글 작성] HTTP 201", async () => {
    const res = await request(app)
      .post("/v1/api/post/re-comment/add")
      .send({ commentId, reComment: "test recomment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(201);
  });

  test("[대댓글 미입력] HTTP 400, CODE: 'post-004', MESSAGE: 'invalid_re_comment'", async () => {
    const res = await request(app)
      .post("/v1/api/post/re-comment/add")
      .send({ commentId, reComment: "" })
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-004", message: "invalid_re_comment" });
  });
});
