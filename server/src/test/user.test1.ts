import { pool } from "../db/db";
import request from "supertest";
import app from "../app";

describe("유저 프로필 API, [GET] /v1/api/user/:userId", () => {
  let userId: string;
  beforeAll(async () => {
    /** 회원가입 */
    const registerRes = await request(app).post("/v1/api/auth/register").send({
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test1",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty("userId");
    userId = registerRes.body.userId;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[유저 프로필 정상 조회] HTTP 200", async () => {
    const res = await request(app).get(`/v1/api/user/${userId}`);

    expect(res.status).toBe(200);
    console.log(res.body);
  });

  test("[유저 ID 미입력] HTTP 404", async () => {
    const res = await request(app).get(`/v1/api/user`);

    expect(res.status).toBe(404);
    console.log(res.body);
  });

  test("[없는 유저아이디 입력] HTTP 404, CODE: 'user-001', MESSAGE: 'user_not_found'", async () => {
    const res = await request(app).get(`/v1/api/user/test`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: "user-001", message: "user_not_found" });
    console.log(res.body);
  });
});

describe("북마크 추가 API [POST] /v1/api/user/bookmark", () => {
  let token: string;
  let postId: string;

  beforeAll(async () => {
    /** 회원가입 */
    const registerRes = await request(app).post("/v1/api/auth/register").send({
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test1",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty("userId");

    /** 2. 로그인 및 토큰 저장 */
    const loginRes = await request(app)
      .post("/v1/api/auth/login")
      .send({ email: "test@test.com", password: "test123!@#" });

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
    postId = addPostRes.body.postId;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[정상 북마크 추가], HTTP 201", async () => {
    const res = await request(app)
      .post("/v1/api/user/bookmark")
      .send({ postId })
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(201);
  });

  test("[존재하지 않는 게시글에 북마크 추가], HTTP 404, CODE: 'user-002', MESSAGE: 'bookmark_post_not_found'", async () => {
    const res = await request(app)
      .post("/v1/api/user/bookmark")
      .send({ postId: "123" })
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: "user-002", message: "bookmark_post_not_found" });
  });
});

describe("북마크 삭제 API, [DELETE] /v1/api/user/bookmark", () => {
  let token: string;
  let postId: string;
  beforeAll(async () => {
    /** 회원가입 */
    const registerRes = await request(app).post("/v1/api/auth/register").send({
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test1",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty("userId");

    /** 2. 로그인 및 토큰 저장 */
    const loginRes = await request(app)
      .post("/v1/api/auth/login")
      .send({ email: "test@test.com", password: "test123!@#" });

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
    postId = addPostRes.body.postId;

    /** 북마크 추가 */
    /** 6. 북마크 생성 */
    const bookmarkRes = await request(app)
      .post("/v1/api/user/bookmark")
      .send({ postId })
      .set({ Authorization: `Bearer ${token}` });

    expect(bookmarkRes.status).toBe(201);
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[북마크 삭제] HTTP 200", async () => {
    const res = await request(app)
      .delete(`/v1/api/user/bookmark/${postId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(200);
  });
});

describe("히스토리 가져오기 API, [GET], /v1/api/user/:userId/history?item=", () => {
  let token: string;
  let userId: string;
  let postId: string;
  let commentId: string;

  beforeAll(async () => {
    /** 회원가입 */
    const registerRes = await request(app).post("/v1/api/auth/register").send({
      email: "test@test.com",
      password: "test123!@#",
      nickname: "test1",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty("userId");
    userId = registerRes.body.userId;

    /** 2. 로그인 및 토큰 저장 */
    const loginRes = await request(app)
      .post("/v1/api/auth/login")
      .send({ email: "test@test.com", password: "test123!@#" });

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
    postId = addPostRes.body.postId;

    /** 3. 게시글 생성 */
    const addPostRes2 = await request(app)
      .post("/v1/api/post/add")
      .send({
        title: "test post title2",
        content: "test post content2",
        category: "notice",
        tags: [{ name: "typescript" }],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(addPostRes2.status).toBe(201);
    expect(addPostRes2.body).toHaveProperty("postId");

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
      .send({ postId, comment: "test comment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addCommentRes2.status).toBe(201);
    expect(addCommentRes2.body).toHaveProperty("commentId");

    /** 5. 대댓글 작성 */
    const addReCommentRes = await request(app)
      .post("/v1/api/post/re-comment/add")
      .send({ commentId, reComment: "test recomment" })
      .set({ Authorization: `Bearer ${token}` });

    expect(addReCommentRes.status).toBe(201);

    /** 6. 북마크 생성 */
    const bookmarkRes = await request(app)
      .post("/v1/api/user/bookmark")
      .send({ postId })
      .set({ Authorization: `Bearer ${token}` });

    expect(bookmarkRes.status).toBe(201);
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[게시글 작성 히스토리 조회], HTTP 200", async () => {
    const res = await request(app).get(`/v1/api/user/${userId}/history?item=post`);

    expect(res.status).toBe(200);
  });

  test("[댓글 작성 히스토리 조회], HTTP 200", async () => {
    const res = await request(app).get(`/v1/api/user/${userId}/history?item=comment`);
    expect(res.status).toBe(200);
  });

  test("[북마크한 게시글 조회], HTTP 200", async () => {
    const res = await request(app).get(`/v1/api/user/${userId}/history?item=bookmark`);

    expect(res.status).toBe(200);
  });
});
