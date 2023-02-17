import { pool } from "../db/db";
import request from "supertest";
import app from "../app";

/** API 주소 */
const LOGIN_API = "/v1/api/auth/login";
const REGISTER_API = "/v1/api/auth/register";
const ADD_POST_API = "/v1/api/post/add";
const ADD_COMMENT_API = "/v1/api/post/comment/add";
const ADD_RE_COMMENT_API = "/v1/api/post/re-comment/add";
const USER_PROFILE_API = "/v1/api/user";
const ADD_BOOKMARK_API = "/v1/api/user/bookmark";
const DELETE_BOOKMARK_API = "/v1/api/user/bookmark";
const USER_PROFILE_UPDATE_API = "/v1/api/user";
const EXIT_USER_API = "/v1/api/user/exit";

/** 계정 관련 설정 */
const EMAIL = "test@test.com";
const PASSWORD = "test123!@#";
const NICKNAME = "test11";
const UPDATED_NICKNAME = "test22";
const UPDATED_INTRODUCE = "UPDATED INTRODUCE";

/** 게시글 관련 설정 */
const POST_TITLE = "POST_TITLE";
const POST_CONTENT = "POST_CONTENT";
const POST_CATEGORY1 = "qna";
const POST_CATEGORY2 = "tech";
const POST_TAG1 = "typescript";
const POST_TAG2 = "express.js";
const POST_TAG3 = "jest";

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
  let commentId: number;
  let reCommentId: number;
  let Authorization: string;

  /** 회원가입 및 userId 저장 */
  const registerRes = await request(app)
    .post(REGISTER_API)
    .send({ email: EMAIL, password: PASSWORD, nickname: NICKNAME });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body).toHaveProperty("userId");
  userId = registerRes.body.userId;

  /** 로그인 및 accessToken 저장 */
  const loginRes = await request(app).post(LOGIN_API).send({ email: EMAIL, password: PASSWORD });
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

describe("유저 프로필 API, [GET] /v1/api/user/:userId", () => {
  let userId: string;

  beforeAll(async () => {
    const data = await SET_UP();
    userId = data.userId;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[유저 프로필 정상 조회] HTTP 200", async () => {
    const res = await request(app).get(`${USER_PROFILE_API}/${userId}`);

    expect(res.status).toBe(200);
  });

  test("[없는 유저아이디 입력] HTTP 404, CODE: 'user-001', MESSAGE: 'user_not_found'", async () => {
    const res = await request(app).get(`/v1/api/user/test`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: "user-001", message: "user_not_found" });
  });
});

describe("유저 프로필 수정 API, [PUT] /v1/api/user/:userId", () => {
  let userId: string;

  beforeAll(async () => {
    const data = await SET_UP();
    userId = data.userId;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상 수정] HTTP 200", async () => {});
});

describe("북마크 추가 API [POST] /v1/api/user/bookmark", () => {
  let postId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    Authorization = data.Authorization;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상 북마크 추가], HTTP 201", async () => {
    const res = await request(app).post(ADD_BOOKMARK_API).send({ postId }).set({ Authorization });

    expect(res.status).toBe(201);
  });

  test("[존재하지 않는 게시글에 북마크 추가], HTTP 404, CODE: 'user-002', MESSAGE: 'bookmark_post_not_found'", async () => {
    const res = await request(app).post(ADD_BOOKMARK_API).send({ postId: "123" }).set({ Authorization });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: "user-002", message: "bookmark_post_not_found" });
  });
});

describe("북마크 삭제 API, [DELETE] /v1/api/user/bookmark", () => {
  let postId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    Authorization = data.Authorization;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[북마크 삭제] HTTP 200", async () => {
    const res = await request(app).delete(`${DELETE_BOOKMARK_API}/${postId}`).set({ Authorization });

    expect(res.status).toBe(200);
  });
});

describe("히스토리 가져오기 API, [GET], /v1/api/user/:userId/history?item=", () => {
  let userId: string;
  let postId: string;
  let commentId: number;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    userId = data.userId;
    postId = data.postId;
    commentId = data.commentId;
    Authorization = data.Authorization;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    await TEAR_DOWN();
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

describe("유저 프로필 수정 API, [PUT] /v1/api/user/:userId/profile", () => {
  let userId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    userId = data.userId;
    Authorization = data.Authorization;
  });

  /** 테스트 후 모든 데이터 초기화 */
  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[닉네임 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${USER_PROFILE_UPDATE_API}/${userId}`)
      .send({ nickname: UPDATED_NICKNAME, introduce: "" })
      .set({ Authorization });

    expect(res.status).toBe(200);

    /** 닉네임 업데이트 후 프로필 가져와서 업데이트 됬는지 확인 */
    const profileRes = await request(app).get(`${USER_PROFILE_API}/${userId}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.nickname).toBe(UPDATED_NICKNAME);
  });

  test("[자기소개 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${USER_PROFILE_UPDATE_API}/${userId}`)
      .send({ nickname: NICKNAME, introduce: UPDATED_INTRODUCE })
      .set({ Authorization });

    expect(res.status).toBe(200);

    /** 닉네임 업데이트 후 프로필 가져와서 업데이트 됬는지 확인 */
    const profileRes = await request(app).get(`${USER_PROFILE_API}/${userId}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.introduce).toBe(UPDATED_INTRODUCE);
  });

  test("[닉네임, 자기소개 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${USER_PROFILE_UPDATE_API}/${userId}`)
      .send({ nickname: UPDATED_NICKNAME, introduce: UPDATED_INTRODUCE })
      .set({ Authorization });

    expect(res.status).toBe(200);

    /** 닉네임 업데이트 후 프로필 가져와서 업데이트 됬는지 확인 */
    const profileRes = await request(app).get(`${USER_PROFILE_API}/${userId}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.nickname).toBe(UPDATED_NICKNAME);
    expect(profileRes.body.introduce).toBe(UPDATED_INTRODUCE);
  });

  test("[닉네임, 자기소개 값이 이전과 동일] HTTP 200", async () => {
    const res = await request(app)
      .put(`${USER_PROFILE_UPDATE_API}/${userId}`)
      .send({ nickname: NICKNAME, introduce: "" })
      .set({ Authorization });

    expect(res.status).toBe(200);
  });

  test("[입력값 없음] HTTP 400, CODE: 'user-004', MESSAGE: 'invalid_profile_data'", async () => {
    const res = await request(app)
      .put(`${USER_PROFILE_UPDATE_API}/${userId}`)
      .send({ nickname: "", introduce: "" })
      .set({ Authorization });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "user-004", message: "invalid_profile_data" });
  });
});
