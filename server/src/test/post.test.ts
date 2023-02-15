import { pool } from "../db/db";
import Secure from "../utils/secure";
import request from "supertest";
import app from "../app";

const LOGIN_API = "/v1/api/auth/login";
const REGISTER_API = "/v1/api/auth/register";
const ADD_POST_API = "/v1/api/post/add";
const ADD_COMMENT_API = "/v1/api/post/comment/add";
const ADD_RE_COMMENT_API = "/v1/api/post/re-comment/add";

/** 계정 관련 설정 */
const EMAIL = "test@test.com";
const PASSWORD = "test123!@#";
const NICKNAME = "test11";

/** 게시글 관련 설정 */
const POST_TITLE = "POST_TITLE";
const POST_CONTENT = "POST_CONTENT";
const POST_CATEGORY1 = "qna";
const POST_CATEGORY2 = "tech";
const POST_TAG1 = "typescript";
const POST_TAG2 = "express.js";

/** 댓글 관련 설정 */
const COMMENT_TEXT = "COMENT_TEXT";
const RE_COMMENT_TEXT = "RE_COMENT_TEXT";

/**
 * 테스트 전 데이터베이스에 관련된 정보를 넣는 함수
 * @returns { userId, accessToken, postId, commentId, reCommentId, Authorization }
 */
const SET_UP = async () => {
  let userId: string;
  let accessToken: string;
  let postId: string;
  let commentId: string;
  let reCommentId: string;
  let Authorization: string;

  /** 회원가입 및 userId 저장 */
  const registerRes = await request(app)
    .post(REGISTER_API)
    .send({ email: EMAIL, password: PASSWORD, nickname: NICKNAME });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body).toHaveProperty("userId");
  userId = registerRes.body.userId;

  /** 로그인 및 accessToken 저장 */
  const loginRes = await request(app).post("/v1/api/auth/login").send({ email: EMAIL, password: PASSWORD });
  expect(loginRes.status).toBe(200);
  expect(loginRes.body).toHaveProperty("accessToken");
  accessToken = loginRes.body.accessToken;
  Authorization = `Bearer ${accessToken}`;

  /** 글 작성 및 postId 저장 */
  const addPostRes = await request(app)
    .post(ADD_POST_API)
    .send({
      title: POST_TITLE,
      content: POST_CONTENT,
      category: `${POST_CATEGORY1}-${POST_CATEGORY2}`,
      tags: [{ name: POST_TAG1 }, { name: POST_TAG2 }],
    })
    .set({ Authorization });

  expect(addPostRes.status).toBe(201);
  expect(addPostRes.body).toHaveProperty("postId");
  postId = addPostRes.body.postId;

  /** 댓글 작성 */
  const addCommentRes = await request(app)
    .post(ADD_COMMENT_API)
    .send({
      postId,
      comment: COMMENT_TEXT,
    })
    .set({ Authorization });

  expect(addCommentRes.status).toBe(201);
  expect(addCommentRes.body).toHaveProperty("commentId");
  commentId = addCommentRes.body.commentId;

  /** 대댓글 작성 */
  const addReCommentRes = await request(app)
    .post(ADD_RE_COMMENT_API)
    .send({
      commentId,
      reComment: RE_COMMENT_TEXT,
    })
    .set({ Authorization });

  expect(addReCommentRes.status).toBe(201);
  expect(addReCommentRes.body).toHaveProperty("reCommentId");
  reCommentId = addReCommentRes.body.reCommentId;

  return { userId, accessToken, postId, commentId, reCommentId, Authorization };
};

const TEAR_DOWN = async () => {
  const connection = await pool.getConnection();
  await connection.execute("CALL truncate_tables");
  connection.destroy();
};

describe("게시글 작성 API, [POST] /v1/api/post/add", () => {
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    Authorization = data.Authorization;
  });

  afterAll(async () => await TEAR_DOWN());

  test("[카테고리가 1개인 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: POST_CATEGORY1,
      tags: [{ name: POST_TAG1 }],
    };

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("postId");
  });

  test("[존재하지 않는 카테고리로 게시글 작성] HTTP 400, CODE: 'post-001', MESSAGE: 'unknown_category'", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: "test",
      tags: [{ name: POST_TAG1 }],
    };

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-001", message: "unknown_category" });
  });

  test("[카테고리가 2개인 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: `${POST_CATEGORY1}-${POST_CATEGORY2}`,
      tags: [{ name: POST_TAG1 }],
    };

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("postId");
  });

  test("[서브 카테고리는 존재하지않는 게시글 작성] HTTP 400, CODE: 'post-001', MESSAGE: 'unknown_category'", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: `${POST_CATEGORY1}-test`,
      tags: [{ name: POST_TAG1 }],
    };

    const res = await request(app).post(ADD_COMMENT_API).send(postData).set({ Authorization });
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

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });

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
    const data = await SET_UP();
  });

  afterAll(async () => {
    await TEAR_DOWN();
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

describe("게시글 삭제 API, [DELETE] /v1/api/post/:postId", () => {
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
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[게시글 삭제] HTTP 200", async () => {
    const res = await request(app)
      .delete(`/v1/api/post/${postId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(200);
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

describe("댓글 삭제 API, [DELETE] /v1/api/post/comment", () => {
  let token: string;
  let postId: string;
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
  });

  afterAll(async () => {
    const connection = await pool.getConnection();
    await connection.execute("CALL truncate_tables");
    connection.destroy();
  });

  test("[댓글 삭제] HTTP 200", async () => {
    const res = await request(app)
      .delete(`/v1/api/post/comment/${commentId}`)
      .set({ Authorization: `Bearer ${token}` });

    console.log(res.body);

    expect(res.status).toBe(201);
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

describe("대댓글 삭제 API, [DELETE] /v1/api/post/re-comment", () => {
  let token: string;
  let postId: string;
  let commentId: number;
  let reCommentId: number;

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
    expect(addReCommentRes.body).toHaveProperty("reCommentId");
    reCommentId = addReCommentRes.body.reCommentId;
  });

  test("[대댓글 삭제] HTTP 200", async () => {
    const res = await request(app)
      .delete(`/v1/api/post/re-comment/${reCommentId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(200);
  });
});
