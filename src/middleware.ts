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
const authRequiredPaths = ["/board"];

// middleware는 Edge Runtime에서 동작
export async function middleware(req: NextRequest) {
	// req.url : 쿼리 포함 path
	// const pathname = req.nextUrl.pathname; // 쿼리제외 path
	const searchParams = req.nextUrl.searchParams;
	// 이미 로그아웃이면 아무것도 안함.
	if (searchParams.get("logout") === "1") return NextResponse.next();

	console.log("url :", req.url, ", method :", req.method, ", req.nextUrl.pathname :", req.nextUrl.pathname);
	// 로그인 url은 그냥 통과
	if (req.nextUrl.pathname === "/api/auth" && req.method === "POST") return NextResponse.next();

	console.log("middleware ---------------------------------");

	const needsAuth = authRequiredPaths.some((v) => req.nextUrl.pathname.startsWith(v));
	if (!needsAuth) return NextResponse.next();

	// ------- 로그인 인증이 필요한 url

	const aToken = req.cookies.get("accessToken");
	try {
		if (aToken) {
			middleware_verifyToken(aToken.value); // 복호화 성공(토큰유효)하면 그대로 진행
			console.log("토큰이 유효");
			return NextResponse.next();
		}
	} catch {
		// 로그아웃 쿼리 추가하여서 리다이렉트
		console.error("aToken decode error");
		const logoutUrl = addLogoutQuery(req.url);
		return NextResponse.redirect(new URL(logoutUrl, req.url));
	}

	// accessToken이 없거나 유효하지 않은 경우 -> refreshToken으로 재발급 시도
	const rToken = req.cookies.get("refreshToken");
	console.log("rToken", rToken);
	if (!rToken) {
		console.error("로그아웃 쿼리 추가하여서 리다이렉트");
		// 로그아웃 쿼리 추가하여서 리다이렉트
		const logoutUrl = addLogoutQuery(req.url);
		return NextResponse.redirect(new URL(logoutUrl, req.url));
	} else {
		console.log("토큰 재발급 url로");
		// req.url에서 '/api/auth/token'요청을 한다라는 뜻 원래 url은 따로 던져야함.
		return NextResponse.redirect(new URL(`/api/auth/token?returnTo=${encodeURIComponent(req.url)}`, req.url));
	}

	// if (!accessToken && req.nextUrl.pathname.startsWith("/dashboard")) {
	// 	return NextResponse.redirect(new URL("/login", req.url));
	// }
}

export const config = {
	// matcher: ["/board/:path*"],
	// matcher: ['/((?!_next|favicon.ico|api|static).*)'],
	//  => _next, static, api 등은 제외 (정적 리소스 요청 제외)
	matcher: ["/((?!_next|favicon.ico|static).*)"],
	// matcher: ["/((?!_next|favicon.ico|api/public|static).*)"],
	// api/public : 인증요청 필요없는 api => 수정해야함
};

// api요청인지 구분
// 요청이 한꺼번에 올 때
