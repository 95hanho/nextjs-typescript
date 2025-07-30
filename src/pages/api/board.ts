import { B_ENDPOINT } from "api/endpoints";
import { get_normal } from "api/fetchFilter";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(요청: NextApiRequest, 응답: NextApiResponse) {
	const res = await get_normal(B_ENDPOINT.TEST_BOARD, { type: "nextjs" });
	if (!res.ok) {
		응답.status(500).json("서버에서 가져오지 못함...");
	}
	const data = await res.json();
	응답.status(200).json({ msg: "success", ...data });
}
