/** 모든 API의 베이스 URL */
export const BASE_URL = "http://dongeu47.iptime.org:5000/v1/api";

/** 인증 관련 */
export const VERIFY_URL = `${BASE_URL}/auth/verify`; // 사용자 인증
export const REGISTER_URL = `${BASE_URL}/auth/register`; // 회원가입
export const LOGIN_URL = `${BASE_URL}/auth/login`; // 로그인
export const TOKEN_URL = `${BASE_URL}/auth/token`; // refresh token으로 access token 재발급
export const LOGOUT_URL = `${BASE_URL}/auth/logout`; // 로그아웃

/** 유저 관련 */
export const PROFILE_URL = `${BASE_URL}/user/profile`; // 유저 프로필

/** 게시글 관련 */
export const ADD_POST_URL = `${BASE_URL}/post/add`; // 글 작성
export const POST_LIST_URL = `${BASE_URL}/post/list`; // 글 목록
export const POST_DETAIL_URL = `${BASE_URL}/post`; // 글 상세정보
export const DELETE_POST_URL = `${BASE_URL}/post`; // 글 상세정보

/** 댓글 관련 */
export const ADD_COMMENT_URL = `${BASE_URL}/post/comment/add`; // 댓글 작성
export const ADD_RE_COMMENT_URL = `${BASE_URL}/post/re-comment/add`; // 댓글 작성

/** 프로필 관련 */
export const USER_PROFILE_URL = `${BASE_URL}/user`; // 유저 프로필 조회
export const USER_PROFILE_UPDATE_URL = `${BASE_URL}/user`; // 유저 프로필 수정
