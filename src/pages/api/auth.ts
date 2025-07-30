import { get_normal } from "api/fetchFilter";
import { B_ENDPOINT } from "api/endpoints";
import { verifyToken } from "libs/jwt";
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

	응답.status(405).json({ msg: "허용되지 않은 메서드입니다." });
}
