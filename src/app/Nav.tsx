"use client";

import useAuth from "hooks/context/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Nav() {
	const { loginOn, logout, me } = useAuth();

	const pathname = usePathname();

	const links = [
		{ href: "/", label: "메인" },
		{ href: "/notice", label: "공지" },
		{ href: "/board", label: "게시판" },
	];

	const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

	return (
		<nav
			id="nav"
			style={{
				borderBottom: "1px solid",
			}}
		>
			{links.map((link) => (
				<React.Fragment key={link.href}>
					<Link href={link.href} className={isActive(link.href) ? "active" : ""}>
						{link.label}
					</Link>{" "}
					|{" "}
				</React.Fragment>
			))}

			{!loginOn ? (
				<Link href="/login" className={isActive("/login") ? "active" : ""}>
					로그인
				</Link>
			) : (
				<button onClick={logout}>{me?.name}님 로그아웃</button>
			)}
		</nav>
	);
}
