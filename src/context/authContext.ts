import { AuthContextType } from "@/types/auth";
import { createContext } from "react";

// 인증관련 컨텍스트
export const authContext = createContext<AuthContextType | null>(null);
