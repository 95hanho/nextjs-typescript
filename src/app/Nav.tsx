"use client";

import useAuth from "@/hooks/context/useAuth";
import Link from "next/link";

export default function Nav() {
	const { loginOn, logout, me } = useAuth();

	return (
		<div
			style={{
				borderBottom: "1px solid",
			}}
		>
			<Link href={"/"}>메인</Link> | <Link href={"/board"}>게시판</Link> |{" "}
			{!loginOn ? <Link href={"/login"}>로그인</Link> : <button onClick={logout}>{me?.name}님 로그아웃</button>}
		</div>
	);
}
