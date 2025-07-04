"use client";

import { Provider } from "react-redux";
import AuthProvider from "./AuthProvider";
import store from "@/store";

export default function AppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Provider store={store}>
			<AuthProvider>{children}</AuthProvider>
		</Provider>
	);
	// return <>{children}</>;
}
