/** 모든 API의 베이스 URL */
export const BASE_URL = "http://localhost:5000/v1/api";

/** 인증 관련 API */
export const VERIFY_URL = `${BASE_URL}/auth/verify`; // 사용자 인증
export const REGISTER_URL = `${BASE_URL}/auth/register`; // 회원가입
export const LOGIN_URL = `${BASE_URL}/auth/login`; // 로그인

/** 유저 관련 API */
export const PROFILE_URL = `${BASE_URL}/user/profile`;
