import { Token } from "@/types/auth";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "./tokenTime";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret"; // 환경변수에 설정하세요
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// accessToken 생성
export function generateAccessToken(payload: object) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRES_IN,
	});
}

// refreshToken 생성
export function generateRefreshToken(payload: object) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRES_IN,
	});
}

// middleware는 Edge Runtime에서 동작 => nodejs환경 jsonwebtoken이 작동안함.
export function verifyToken(token: string): Token {
	return jwt.verify(token, JWT_SECRET) as Token; // 실패 시 오류 발생
}

export async function middleware_verifyToken(token: string): Promise<Token> {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload as Token;
	} catch (err) {
		console.error("Token verify failed", err);
		throw err;
	}
}
