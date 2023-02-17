import { pool } from "../db/db";
import Secure from "../utils/secure";
import request from "supertest";
import app from "../app";

/** API 주소 */
const LOGIN_API = "/v1/api/auth/login";
const REGISTER_API = "/v1/api/auth/register";
const ADD_POST_API = "/v1/api/post/add";
const ADD_COMMENT_API = "/v1/api/post/comment/add";
const ADD_RE_COMMENT_API = "/v1/api/post/re-comment/add";
const POST_LIST_API = "/v1/api/post/list";
const POST_DETAIL_API = "/v1/api/post";
const POST_DELETE_API = "/v1/api/post";
const DELETE_COMMENT_API = "/v1/api/post/comment";
const DELETE_RE_COMMENT_API = "/v1/api/post/re-comment";
const UPDATE_COMMENT_API = "/v1/api/post/comment";
const UPDATE_RE_COMMENT_API = "/v1/api/post/re-comment";
const UPDATE_POST_API = "/v1/api/post";

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

const UPDATED_POST_TITLE = "UPDATED_POST_TITLE";
const UPDATED_POST_CONTENT = "UPDATED_POST_CONTENT";
const UPDATED_POST_CATEGORY1 = "knowledge";
const UPDATED_POST_CATEGORY2 = "tip";
const UPDATED_POST_TAG1 = "javascript";
const UPDATED_POST_TAG2 = "nodemon";

/** 댓글 관련 설정 */
const COMMENT_TEXT = "COMENT TEXT";
const RE_COMMENT_TEXT = "RE COMENT TEXT";
const UPDATED_COMMENT_TEXT = "UPDATED COMMENT TEXT";
const UPDATED_RE_COMMENT_TEXT = "UPDATED RE COMMENT TEXT";

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

  test("[서브 카테고리가 존재하지않는 게시글 작성] HTTP 400, CODE: 'post-001', MESSAGE: 'unknown_category'", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: `${POST_CATEGORY1}-test`,
      tags: [{ name: POST_TAG1 }],
    };

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-001", message: "unknown_category" });
  });

  test("[해시태그 1개로 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: `${POST_CATEGORY1}`,
      tags: [{ name: POST_TAG1 }],
    };

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("postId");
  });

  test("[해시태그 3개로 게시글 작성] HTTP 201", async () => {
    const postData = {
      title: POST_TITLE,
      content: POST_CONTENT,
      category: `${POST_CATEGORY1}`,
      tags: [{ name: POST_TAG1 }, { name: POST_TAG2 }],
    };

    const res = await request(app).post(ADD_POST_API).send(postData).set({ Authorization });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("postId");
  });
});

describe("게시글 목록 API, [GET] /v1/api/post/list/category1=&category2=", () => {
  beforeAll(async () => {
    const data = await SET_UP();
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[카테고리가 1개인 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get(`${POST_LIST_API}?category1=${POST_CATEGORY1}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[카테고리가 2개인 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get(
      `${POST_LIST_API}?category1=${POST_CATEGORY1}&category2=${POST_CATEGORY2}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[첫번째 카테고리는 정상, 서브 카테고리는 없는 게시글 조회] HTTP 200, 게시글 목록 반환", async () => {
    const res = await request(app).get(`${POST_LIST_API}?category1=${POST_CATEGORY1}&category2=test`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("posts");
  });

  test("[이상한 카테고리로 게시글 조회] HTTP 400, CODE: 'post-002', MESSAGE: 'unknown_category'", async () => {
    const res = await request(app).get(`${POST_LIST_API}?category1=test`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-002", message: "unknown_category" });
  });
});

describe("게시글 상세보기 API, [GET] /v1/api/post/:postId", () => {
  let postId: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상적인 게시글 조회] HTTP 200", async () => {
    const res = await request(app).get(`${POST_DETAIL_API}/${postId}`);
    expect(res.status).toBe(200);
  });

  test("[게시글 아이디 없음] HTTP 404, CODE : 'post-005', MESSAGE: 'not_found_post'", async () => {
    const res = await request(app).get(`${POST_DETAIL_API}/test`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: "post-005", message: "post_not_found" });
  });
});

describe("게시글 삭제 API, [DELETE] /v1/api/post/:postId", () => {
  let postId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[게시글 삭제] HTTP 200", async () => {
    const res = await request(app).delete(`${POST_DELETE_API}/${postId}`).set({ Authorization });
    expect(res.status).toBe(200);
  });
});

describe("게시글 수정 API, [PUT] /v1/api/post/:postId", () => {
  let postId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[제목 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_POST_API}/${postId}`)
      .send({
        title: UPDATED_POST_TITLE,
        content: POST_CONTENT,
        category: `${POST_CATEGORY1}-${POST_CATEGORY2}`,
        tags: [{ name: POST_TAG1 }, { name: POST_TAG2 }],
      })
      .set({ Authorization });

    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DELETE_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.title).toBe(UPDATED_POST_TITLE);
  });

  test("[내용 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_POST_API}/${postId}`)
      .send({
        title: POST_TITLE,
        content: UPDATED_POST_CONTENT,
        category: `${POST_CATEGORY1}-${POST_CATEGORY2}`,
        tags: [{ name: POST_TAG1 }, { name: POST_TAG2 }],
      })
      .set({ Authorization });

    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DELETE_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.content).toBe(UPDATED_POST_CONTENT);
  });

  test("[카테고리 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_POST_API}/${postId}`)
      .send({
        title: POST_TITLE,
        content: POST_CONTENT,
        category: `${UPDATED_POST_CATEGORY1}-${UPDATED_POST_CATEGORY2}`,
        tags: [{ name: POST_TAG1 }, { name: POST_TAG2 }],
      })
      .set({ Authorization });

    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DELETE_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.category).toBe(`${UPDATED_POST_CATEGORY1}-${UPDATED_POST_CATEGORY2}`);
  });

  test("[태그 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_POST_API}/${postId}`)
      .send({
        title: POST_TITLE,
        content: POST_CONTENT,
        category: `${POST_CATEGORY1}-${POST_CATEGORY2}`,
        tags: [{ name: UPDATED_POST_TAG1 }, { name: UPDATED_POST_TAG2 }],
      })
      .set({ Authorization });

    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DELETE_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.tags).toEqual([{ name: UPDATED_POST_TAG1 }, { name: UPDATED_POST_TAG2 }]);
  });

  test("[전체내용 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_POST_API}/${postId}`)
      .send({
        title: UPDATED_POST_TITLE,
        content: UPDATED_POST_CONTENT,
        category: `${UPDATED_POST_CATEGORY1}-${UPDATED_POST_CATEGORY2}`,
        tags: [{ name: UPDATED_POST_TAG1 }, { name: UPDATED_POST_TAG2 }],
      })
      .set({ Authorization });

    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DELETE_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.title).toBe(UPDATED_POST_TITLE);
    expect(postRes.body.content).toBe(UPDATED_POST_CONTENT);
    expect(postRes.body.category).toBe(`${UPDATED_POST_CATEGORY1}-${UPDATED_POST_CATEGORY2}`);
    expect(postRes.body.tags).toEqual([{ name: UPDATED_POST_TAG1 }, { name: UPDATED_POST_TAG2 }]);
  });

  test("[내용에 빈값이 있을경우] HTTP 400, CODE: 'post-008', MESSAGE: 'invalid_post_data'", async () => {
    const res = await request(app)
      .put(`${UPDATE_POST_API}/${postId}`)
      .send({
        title: "",
        content: POST_CONTENT,
        category: `${UPDATED_POST_CATEGORY1}-${UPDATED_POST_CATEGORY2}`,
        tags: [{ name: POST_TAG1 }, { name: POST_TAG2 }],
      })
      .set({ Authorization });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-008", message: "invalid_post_data" });
  });
});

describe("댓글 작성 API, [POST] /v1/api/post/comment/add", () => {
  let postId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상적인 댓글작성] HTTP 201", async () => {
    const res = await request(app)
      .post(ADD_COMMENT_API)
      .send({ postId, comment: COMMENT_TEXT })
      .set({ Authorization });

    expect(res.status).toBe(201);
  });

  test("[댓글 미입력] HTTP 400, CODE: 'post-003', MESSAGE: 'invalid_comment'", async () => {
    const res = await request(app)
      .post("/v1/api/post/comment/add")
      .send({ postId, comment: "" })
      .set({ Authorization });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-003", message: "invalid_comment" });
  });
});

describe("댓글 삭제 API, [DELETE] /v1/api/post/comment", () => {
  let postId: string;
  let commentId: number;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    commentId = data.commentId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[댓글 삭제] HTTP 200", async () => {
    const res = await request(app).delete(`${DELETE_COMMENT_API}/${commentId}`).set({ Authorization });
    expect(res.status).toBe(200);
  });
});

describe("댓글 수정 API, [PUT] /v1/api/post/comment/:commentId", () => {
  let postId: string;
  let commentId: number;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    commentId = data.commentId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[댓글 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_COMMENT_API}/${commentId}`)
      .send({ commentText: UPDATED_COMMENT_TEXT })
      .set({ Authorization });
    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DETAIL_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.comments[0].content).toBe(UPDATED_COMMENT_TEXT);
  });

  test("[댓글 내용이 없을경우] HTTP 400, CODE: 'post-006', MESSAGE: 'invalid_updated_comment'", async () => {
    const res = await request(app)
      .put(`${UPDATE_COMMENT_API}/${commentId}`)
      .send({ commentText: "" })
      .set({ Authorization });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-006", message: "invalid_updated_comment" });
  });
});

describe("대댓글 작성 API, [POST] /v1/api/post/re-comment/add", () => {
  let commentId: number;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    commentId = data.commentId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[정상적인 대댓글 작성] HTTP 201", async () => {
    const res = await request(app)
      .post(`${ADD_RE_COMMENT_API}`)
      .send({ commentId, reComment: RE_COMMENT_TEXT })
      .set({ Authorization });

    expect(res.status).toBe(201);
  });

  test("[대댓글 미입력] HTTP 400, CODE: 'post-004', MESSAGE: 'invalid_re_comment'", async () => {
    const res = await request(app)
      .post(`${ADD_RE_COMMENT_API}`)
      .send({ commentId, reComment: "" })
      .set({ Authorization });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-004", message: "invalid_re_comment" });
  });
});

describe("대댓글 삭제 API, [DELETE] /v1/api/post/re-comment", () => {
  let reCommentId: number;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    reCommentId = data.reCommentId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[대댓글 삭제] HTTP 200", async () => {
    const res = await request(app).delete(`${DELETE_RE_COMMENT_API}/${reCommentId}`).set({ Authorization });

    expect(res.status).toBe(200);
  });
});

describe("대댓글 수정 API, [PUT] /v1/api/post/re-comment/:reCommentId", () => {
  let postId: string;
  let reCommentId: number;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    reCommentId = data.reCommentId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[대댓글 수정] HTTP 200", async () => {
    const res = await request(app)
      .put(`${UPDATE_RE_COMMENT_API}/${reCommentId}`)
      .send({ reCommentText: UPDATED_RE_COMMENT_TEXT })
      .set({ Authorization });

    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DETAIL_API}/${postId}`);

    expect(postRes.status).toBe(200);
    expect(postRes.body.comments[0].reComment[0].content).toBe(UPDATED_RE_COMMENT_TEXT);
  });

  test("[대댓글 내용이 없을경우] HTTP 400, CODE: 'post-007', MESSAGE: 'invalid_updated_re_comment'", async () => {
    const res = await request(app)
      .put(`${UPDATE_RE_COMMENT_API}/${reCommentId}`)
      .send({ reCommentText: "" })
      .set({ Authorization });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: "post-007", message: "invalid_updated_re_comment" });
  });
});

describe("게시글 추천 API, [POST] /v1/api/post/:postId/recommend", () => {
  let postId: string;
  let Authorization: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
    Authorization = data.Authorization;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[추천 추가] HTTP 200", async () => {
    const res = await request(app).post(`/v1/api/post/${postId}/recommend`).set({ Authorization });
    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DETAIL_API}/${postId}`);
    expect(postRes.status).toBe(200);
    expect(postRes.body.recommendCnt).toBe(1);
  });

  test("[추천 삭제] HTTP 200", async () => {
    const res = await request(app).post(`/v1/api/post/${postId}/recommend`).set({ Authorization });
    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DETAIL_API}/${postId}`);
    expect(postRes.status).toBe(200);
    expect(postRes.body.recommendCnt).toBe(0);
  });
});

describe("게시글 조회수 추가 API, [PATCH] /v1/api/post/:postId/views", () => {
  let postId: string;

  beforeAll(async () => {
    const data = await SET_UP();
    postId = data.postId;
  });

  afterAll(async () => {
    await TEAR_DOWN();
  });

  test("[조회수 추가] HTTP 200", async () => {
    const res = await request(app).patch(`/v1/api/post/${postId}/views`);
    expect(res.status).toBe(200);

    const postRes = await request(app).get(`${POST_DETAIL_API}/${postId}`);
    expect(postRes.status).toBe(200);
    expect(postRes.body.viewCount).toBe(1);
  });
});
