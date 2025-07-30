import { B_ENDPOINT } from "api/endpoints";
import { post_urlFormData } from "api/fetchFilter";
import { generateAccessToken, generateRefreshToken } from "libs/jwt";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "libs/tokenTime";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(요청: NextApiRequest, 응답: NextApiResponse) {
	try {
		console.log(요청.body);
		const { id, password } = 요청.body;
		if (!id) 응답.status(400).json({ msg: "아이디를 입력해주세요." });
		if (!password) 응답.status(400).json({ msg: "비밀번호를 입력해주세요." });
		console.log(process.env.SERVER_URL);
		console.log(B_ENDPOINT.TEST_USER);

		const accessToken = generateAccessToken({ id });
		const refreshToken = generateRefreshToken({ id });

		console.log(`'${accessToken}'`);

		const res = await post_urlFormData(B_ENDPOINT.TEST_USER + "?type=nextjs", { ...요청.body, nextjs_token: refreshToken });
		if (res.status === 400) {
			응답.status(400).json({ msg: "입력하신 아이디 또는 비밀번호가 일치하지 않습니다" });
		}
		if (res.ok) {
			// ✅ HttpOnly 쿠키 설정
			const data = await res.json();
			console.log(data);
			응답.setHeader("Set-Cookie", [
				`accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${ACCESS_TOKEN_AGE}`,
				`refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${REFRESH_TOKEN_AGE}`,
			]);
			return 응답.status(200).json({ msg: "로그인 성공" });
		}

		return 응답.status(res.status).json({ msg: "로그인 실패", status: res.status });
	} catch (error) {
		console.error("서버 통신 에러 :", error);
		return 응답.status(500).json({ msg: "서버 오류, 다시 시도해주세요." });
	}
}
