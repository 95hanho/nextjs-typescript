import { get_normal, post_urlFormData } from "@/api/apiFilter";
import { B_ENDPOINT } from "@/api/endpoints";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@/libs/jwt";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "@/libs/tokenTime";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(요청: NextApiRequest, 응답: NextApiResponse) {
	console.log(요청.url);
	console.log(요청.method);
	console.log(요청.query);

	if (요청.method == "GET") {
		const accessToken = 요청.cookies.accessToken;
		console.log("token", accessToken);
		if (!accessToken) {
			return 응답.status(401).json({ msg: "토큰없음" });
		}
		try {
			const token = verifyToken(accessToken);
			// if (res.status === 401) {
			// 	return 응답.status(401).json({ msg: "유효하지 않은 토큰" });
			// }
			const res = await get_normal(B_ENDPOINT.TEST_USER, {
				type: "nextjs",
				nextId: token.id,
			});

			if (res.ok) {
				const data = await res.json();
				return 응답.status(200).json({ msg: "로그인 성공", user: data.user });
			}
			return 응답.status(res.status).json({ msg: "유저가져오기 서버 오류", status: res.status });
		} catch (error) {
			console.error("서버 통신 에러 :", error);
			return 응답.status(500).json({ msg: "서버 오류, 다시 시도해주세요." });
		}
	}

	if (요청.method == "POST") {
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

	응답.status(405).json({ msg: "허용되지 않은 메서드입니다." });
}
