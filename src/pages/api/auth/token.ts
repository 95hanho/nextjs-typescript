import { post_urlFormData } from "api/fetchFilter";
import { B_ENDPOINT } from "api/endpoints";
import { addLogoutQuery } from "libs/auth";
import { generateAccessToken, generateRefreshToken, verifyToken } from "libs/jwt";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "libs/tokenTime";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(요청: NextApiRequest, 응답: NextApiResponse) {
	const originUrl = decodeURIComponent(요청.query.returnTo as string);
	const logoutUrl = addLogoutQuery(originUrl);
	console.log("토큰 재발급 실행", originUrl, logoutUrl);

	const refreshToken = 요청.cookies.refreshToken;
	try {
		if (refreshToken) {
			const decoded = verifyToken(refreshToken);
			console.log(decoded);
			const id = decoded.id;
			const newAccessToken = generateAccessToken({ id });
			const newRefreshToken = generateRefreshToken({ id });
			const res = await post_urlFormData(B_ENDPOINT.TEST_USER_TOKEN + "?type=nextjs", {
				nextId: id,
				nextjs_token: refreshToken,
				nextjs_newToken: newRefreshToken,
			});
			if (!res.ok) {
				응답.writeHead(302, { location: logoutUrl });
				응답.end();
				console.log("해당 r토큰이 DB와 불일치");
				return;
				// return NextResponse.redirect(new URL(logoutUrl));
			}
			응답.setHeader("Set-Cookie", [
				`accessToken=${newAccessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${ACCESS_TOKEN_AGE}`,
				`refreshToken=${newRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${REFRESH_TOKEN_AGE}`,
			]);
			// return NextResponse.redirect(originUrl);
			// ✅ 여기도 NextResponse ❌
			응답.writeHead(302, { location: originUrl });
			응답.end();
			console.log("토큰 재발급 성공 =>", originUrl, "로 돌아감.");
			return;
		}
	} catch (error) {
		console.log("에러 발생", error);
		// return NextResponse.redirect(new URL(logoutUrl));
		console.error("rToken reToken error");
		응답.writeHead(302, { location: logoutUrl });
		응답.end();
		return;
	}
}
