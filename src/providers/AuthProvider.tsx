"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authContext } from "@/context/authContext";
import { F_ENDPOINTS } from "@/api/endpoints";
import { get_normal } from "@/api/fetchFilter";
import { Me } from "@/types/auth";

/* 인증관련 설정 */
export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const logoutOn = searchParams?.get("logout") == "1";
	const curUrl = useMemo(() => {
		const queryString = !searchParams ? "" : `?${searchParams.toString()}`;
		return pathname + queryString;
	}, [pathname, searchParams]);

	const [loading, set_loading] = useState<boolean>(true);
	const [loginOn, set_loginOn] = useState<boolean>(false);
	const [me, set_me] = useState<Me>(null);

	// 로그아웃
	const logout = async () => {
		console.log("로그아웃");
		set_loginOn(false);
		await get_normal(F_ENDPOINTS.TEST_USER_LOGOUT);
	};

	const getUserInfo = useCallback(async () => {
		const res = await get_normal(F_ENDPOINTS.TEST_USER);
		if (res.ok) {
			set_loginOn(true);
			const data = await res.json();
			set_me({ ...data.user });
		}
		set_loading(false); // 초기 새로고침 시 동작
	}, []);

	// 새로고침or처음로드 시 토큰검사 및 유저정보가져오기
	useEffect(() => {
		if (!me) getUserInfo();
	}, [curUrl, me, getUserInfo]);

	useEffect(() => {
		if (logoutOn && pathname) {
			if (loginOn) {
				alert("로그아웃 되었습니다.");
			}
			const newParams = new URLSearchParams(searchParams.toString());
			newParams.delete("logout");
			const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
			router.replace(newUrl);
		}
	}, [loginOn, logoutOn, pathname, router, searchParams]);

	if (loading) return null; // 처음 새로고침 시 useEffect를 무조건 하고 실행하기
	return <authContext.Provider value={{ loginOn, set_loginOn, logout, me }}>{children}</authContext.Provider>;
}
