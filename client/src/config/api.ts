/** 모든 API의 베이스 URL */
export const BASE_URL = "http://localhost:5000";

/** 인증 관련 */
export const VERIFY_URL = `${BASE_URL}/auth/verify`; // 사용자 인증
export const REGISTER_URL = `${BASE_URL}/auth/register`; // 회원가입
export const LOGIN_URL = `${BASE_URL}/auth/login`; // 로그인
export const TOKEN_URL = `${BASE_URL}/auth/token`; // refresh token으로 access token 재발급
export const LOGOUT_URL = `${BASE_URL}/auth/logout`; // 로그아웃

/** 게시글 관련 */
export const ADD_POST_URL = `${BASE_URL}/boards`; // 글 작성
export const POST_LIST_URL = `${BASE_URL}/post/list`; // 글 목록
export const POST_DETAIL_URL = `${BASE_URL}/post`; // 글 상세정보
export const DELETE_POST_URL = `${BASE_URL}/post`; // 글 상세정보
export const UPDATE_POST_URL = `${BASE_URL}/post`; // 글 상세정보
export const POST_VIEW_COUNT_URL = `${BASE_URL}/post`; // 글 조회수 추가
export const POST_RECOMMENDATION_URL = `${BASE_URL}/post`; // 글 조회수 추가
export const POST_USER_ACTIVITY_URL = `${BASE_URL}/post`; // 글에 대한 유저의 활동내역(추천, 북마크)

/** 댓글 관련 */
export const ADD_COMMENT_URL = `${BASE_URL}/post/comment/add`; // 댓글 작성
export const ADD_RE_COMMENT_URL = `${BASE_URL}/post/re-comment/add`; // 댓글 작성
export const DELETE_COMMENT_URL = `${BASE_URL}/post/comment`; // 댓글 작성
export const DELETE_RE_COMMENT_URL = `${BASE_URL}/post/re-comment`; // 댓글 작성
export const UPDATE_COMMENT_URL = `${BASE_URL}/post/comment`; // 댓글 수정
export const UPDATE_RE_COMMENT_URL = `${BASE_URL}/post/re-comment`; // 대댓글 수정

/** 유저 관련 */
export const USER_PROFILE_URL = `${BASE_URL}/user`; // 유저 프로필 조회
export const USER_PROFILE_UPDATE_URL = `${BASE_URL}/user`; // 유저 프로필 수정
export const USER_PROFILE_IMAGE_UPDATE = `${BASE_URL}/user/image`; // 유저 프로필 이미지 수정
export const ADD_BOOKMARK_URL = `${BASE_URL}/user/bookmark`; // 북마크 추가
export const DELETE_BOOKMARK_URL = `${BASE_URL}/user/bookmark`; // 북마크 삭제
export const HISTORY_URL = `${BASE_URL}/user`; // 히스토리 조회
export const EXIT_USER_URL = `${BASE_URL}/user/exit`;
