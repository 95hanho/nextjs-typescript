// 페이지 urlParam과 쿼리
export interface PageProps {
	params?: { [key: string]: string };
	searchParams?: { [key: string]: string | string[] | undefined };
}

export type ApiResponse = {
	status?: number;
	msg: string;
};
