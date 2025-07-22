"use client";

/* 로그인 페이지 */
// import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import useAuth from "@/hooks/context/useAuth";
import { LoginData } from "@/types/auth";
import { F_ENDPOINTS } from "@/api/endpoints";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { post_json } from "@/api/fetchFilter";

const LoginMain = styled.div`
	padding: 30px;
`;

export default function Login() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const message = searchParams?.get("message");
	console.log("message", message);
	console.log("pathname", pathname);

	const { set_loginOn } = useAuth();

	const [user, set_user] = useState<LoginData>({
		id: "hoseongs",
		password: "aaaaaa1!",
	});

	const login_before = async (e: React.FormEvent) => {
		console.log("login_before");
		e.preventDefault();
		const res = await post_json(F_ENDPOINTS.TEST_USER, user);
		const data = await res.json();

		if (res.ok) {
			set_loginOn(true);
			router.push("/");
		} else {
			alert(data.msg);
		}
	};

	useEffect(() => {
		if (pathname && message === "need_login") {
			alert("로그인이 필요한 메시지 입니다.");
			// 쿼리 파라미터 없이 현재 경로로 이동
			router.replace(pathname);
		}
	}, [pathname, message, router]);

	return (
		<LoginMain id="login">
			<form onSubmit={login_before}>
				<h4>로그인</h4>
				<div>
					아이디:{" "}
					<input
						type="text"
						value={user.id}
						onChange={(e) =>
							set_user((prev) => ({
								...prev,
								id: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					비밀번호:{" "}
					<input
						type="password"
						autoComplete="false"
						value={user.password}
						onChange={(e) => set_user((prev) => ({ ...prev, password: e.target.value }))}
					/>
				</div>
				<div>
					<input type="submit" value={"로그인"} />
					<input type="button" value={"회원가입"} onClick={() => router.push("/user/sign-up")} />{" "}
					<input type="button" value={"아이디찾기"} onClick={() => router.push("/user/sign-up")} />{" "}
					<input type="button" value={"비밀번호찾기"} onClick={() => router.push("/user/sign-up")} />
				</div>
			</form>
		</LoginMain>
	);
}
