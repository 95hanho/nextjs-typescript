import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(요청: NextApiRequest, 응답: NextApiResponse) {
	응답.setHeader("Set-Cookie", [
		`accessToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
		`refreshToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
	]);

	return 응답.status(200).json({ msg: "success" });
}
