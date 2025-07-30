"use client";

import { Provider } from "react-redux";
import AuthProvider from "./AuthProvider";
import store from "store";
import AxiosInterceptor from "./AxiosInterceptor";

export default function AppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Provider store={store}>
			<AuthProvider>
				<AxiosInterceptor>{children}</AxiosInterceptor>
			</AuthProvider>
		</Provider>
	);
	// return <>{children}</>;
}
