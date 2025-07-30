"use client";

import { get_normal } from "api/axiosFilter";
import { F_ENDPOINTS } from "api/endpoints";
import moment from "moment";
import { useState } from "react";

type BoardList = {
	board_id: number;
	content: string;
	created_at: string;
	name: string;
	title: string;
	user_id: string;
};

type BoardData = {
	msg: string;
	boardList: BoardList[];
};

interface BoardListProp {
	boarddata: BoardData;
}

export default function BoardList({ boarddata }: BoardListProp) {
	const [boardList, set_boardList] = useState(boarddata.boardList);
	// 게시물 또 가져오기
	const re_getBoards = async () => {
		const res = await get_normal(F_ENDPOINTS.TEST_BOARD);
		if (res.status !== 200) {
			alert("게시물 또 가져오기 실패!!");
			return;
		}
		const data: BoardData = res.data;
		set_boardList((prev) => {
			return [...prev, ...data.boardList];
		});
	};
	return (
		<div className="board-list">
			<table border={1}>
				<thead>
					<tr>
						<th>id</th>
						<th>제목</th>
						<th>내용</th>
						<th>작성자</th>
						<th>작성일자</th>
					</tr>
				</thead>
				<tbody>
					{boardList.map((board, index) => (
						<tr key={"board" + board.board_id + "-" + index}>
							<td>{board.board_id}</td>
							<td>{board.title}</td>
							<td>{board.content}</td>
							<td>{board.name}</td>
							<td>{moment(board.created_at).format("YY.MM.DD hh:mm a")}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<button onClick={re_getBoards}>게시판 또 가져오기</button>
			</div>
		</div>
	);
}
