// src/middleware.ts or /middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { middleware_verifyToken, verifyToken } from "./libs/jwt";
import { addLogoutQuery } from "./libs/auth";

// async function logoutRedirect(req: NextRequest) {
// 	const response = NextResponse.redirect(new URL("/login?message=need_login", req.url));
// 	response.cookies.delete("accessToken");
// 	response.cookies.delete("refreshToken");
// 	return response;
// }

const protectedPaths = ["/profile", "/dashboard", "/admin"]; // 로그인 필요한 경로들

export async function middleware(req: NextRequest) {
	// req.url : 쿼리 포함 path
	// const pathname = req.nextUrl.pathname; // 쿼리제외 path
	const searchParams = req.nextUrl.searchParams;
	// 이미 로그아웃이면 아무것도 안함.
	if (searchParams.get("logout") === "1") return NextResponse.next();

	console.log("req.url", req.url, req.method);
	if (req.nextUrl.pathname === "/api/auth" && req.method === "POST") return NextResponse.next();

	console.log("middleware ---------------------------------");

	const aToken = req.cookies.get("accessToken");
	try {
		if (aToken) {
			console.log(`'${aToken.value}'`);
			middleware_verifyToken(aToken.value); // 유효하면 그대로 진행
			return NextResponse.next();
		}
	} catch {
		console.error("aToken decode error");
		const logoutUrl = addLogoutQuery(req.url);
		return NextResponse.redirect(new URL(logoutUrl, req.url));
	}

	// accessToken이 없거나 유효하지 않은 경우 -> refreshToken으로 재발급 시도
	const rToken = req.cookies.get("refreshToken");
	console.log("rToken", rToken);
	if (!rToken) {
		const logoutUrl = addLogoutQuery(req.url);
		return NextResponse.redirect(new URL(logoutUrl, req.url));
	} else {
		// req.url에서 '/api/auth/token'요청을 한다라는 뜻 원래 url은 따로 던져야함.
		return NextResponse.redirect(new URL(`/api/auth/token?returnTo=${encodeURIComponent(req.url)}`, req.url));
	}

	// if (!accessToken && req.nextUrl.pathname.startsWith("/dashboard")) {
	// 	return NextResponse.redirect(new URL("/login", req.url));
	// }
}

export const config = {
	matcher: ["/board/:path*"],
};

// 요청이 한꺼번에 올 때
