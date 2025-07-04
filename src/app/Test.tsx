"use client";

import { F_ENDPOINTS } from "@/api/endpoints";
import { useEffect } from "react";

export default function Test() {
	const init = async () => {
		const testAPI = await fetch(F_ENDPOINTS.TEST);
		const response = await testAPI.json();
		console.log("response", response);
	};

	useEffect(() => {
		init();
	}, []);

	return <div>TEST</div>;
}
