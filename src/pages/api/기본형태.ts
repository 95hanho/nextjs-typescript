import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(요청: NextApiRequest, 응답: NextApiResponse) {
	console.log(요청.url);
	console.log(요청.method);
	console.log(요청.query);

	return 응답.status(200).json({ msg: "success" });
}
