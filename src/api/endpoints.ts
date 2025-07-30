import { getBaseUrl, getBackBaseUrl } from "libs/getBaseUrl";

const test_auth = "/auth";
const test_board = "/board";

export const F_ENDPOINTS = {
	TEST: getBaseUrl() + "/test",
	// 테스트
	TEST_USER: getBaseUrl() + test_auth, // 유저정보가져오기
	TEST_USER_LOGIN: getBaseUrl() + test_auth + "/login", // 로그인
	TEST_USER_LOGOUT: getBaseUrl() + test_auth + "/logout", // 로그아웃
	TEST_ID_DUPL_CHECK: getBaseUrl() + test_auth + "/id", // 아이디중복확인
	TEST_PHONE_AUTH: getBaseUrl() + test_auth + "/phone", // 휴대폰 인증
	TEST_USER_JOIN: getBaseUrl() + test_auth + "/member", // 회원가입
	TEST_USER_TOKEN: getBaseUrl() + test_auth + "/token", // 토큰재발급
	TEST_BOARD: getBaseUrl() + test_board, // 게시물리스트
};
export const B_ENDPOINT = {
	TEST: getBackBaseUrl() + "/test",
	// 테스트
	TEST_USER: getBackBaseUrl() + test_auth, // 유저정보가져오기, 로그인
	TEST_ID_DUPL_CHECK: getBackBaseUrl() + test_auth + "/id", // 아이디중복확인
	TEST_PHONE_AUTH: getBackBaseUrl() + test_auth + "/phone", // 휴대폰 인증
	TEST_USER_JOIN: getBackBaseUrl() + test_auth + "/member", // 회원가입
	TEST_USER_TOKEN: getBackBaseUrl() + test_auth + "/token", // 토큰재발급
	TEST_BOARD: getBackBaseUrl() + test_board, // 게시물리스트
};
