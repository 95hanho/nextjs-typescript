import { F_ENDPOINTS } from "api/endpoints";
import { get_normal } from "api/fetchFilter";
import BoardList from "./BoardList";
import { cookies } from "next/headers";

export default async function BoardPage() {
	const cookieList = await cookies();
	const res = await get_normal(F_ENDPOINTS.TEST_BOARD, undefined, {
		refreshToken: cookieList.get("refreshToken")?.value || "",
		accessToken: cookieList.get("accessToken")?.value || "",
	});
	if (!res.ok) {
		return (
			<main>
				<p>게시물 데이터를 가져오지 못했습니다. (status: {res.status})</p>
			</main>
		);
	}

	let data;
	try {
		data = await res.json();
	} catch (e) {
		return (
			<main>
				<p>JSON 파싱 오류: {(e as Error).message}</p>
			</main>
		);
	}

	return (
		<main>
			<BoardList boarddata={data}></BoardList>
		</main>
	);
}
