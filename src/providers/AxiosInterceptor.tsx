"use client";

import { instance } from "api/axiosInstance";
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

export default function AxiosInterceptor({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// 요청 성공
	const requestFulfill = async (config: RetryableAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
		console.log("requestFulfill");
		return config;
	};
	// 요청 에러
	const requestReject = (error: AxiosError): Promise<never> => {
		console.log(error.message + "--->>>" + error.config?.url);
		return Promise.reject(error);
	};
	// 응답 성공
	const responseFulfill = (response: AxiosResponse): AxiosResponse => {
		console.log("responseFulfill");
		return response;
	};
	// 응답 에러
	const responseReject = async (error: AxiosError): Promise<never> => {
		console.log(error);

		// 인증 오류
		if (error.status === 401) {
			alert("로그아웃되었습니다. ==> in axios");
			if (searchParams && pathname) {
				const newParams = new URLSearchParams(searchParams.toString());
				const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
				console.log("newUrl", newUrl);
				// router.replace(newUrl);
				router.replace(`/login?redirect=${encodeURIComponent(newUrl)}`);
			}
		}

		return Promise.reject(error);
	};

	const requestInterceptors = instance.interceptors.request.use(requestFulfill, requestReject);
	const responseInterceptors = instance.interceptors.response.use(responseFulfill, responseReject);
	useEffect(() => {
		console.log("AxiosInterceptor useEffect");
		return () => {
			console.log("AxiosInterceptor return useEffect");
			instance.interceptors.request.eject(requestInterceptors);
			instance.interceptors.response.eject(responseInterceptors);
		};
	}, [pathname, requestInterceptors, responseInterceptors]);

	return children;
}
