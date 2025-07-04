import { JwtPayload } from "jsonwebtoken";

export type LoginData = {
	id: string;
	password: string;
};

export interface AuthContextType {
	loginOn: boolean;
	set_loginOn: React.Dispatch<boolean>;
	logout: () => void;
	me: Me;
}

export type Me = {
	id: string;
	name: string;
	zonecode: string;
	address: string;
	birthday: string;
	phone: string;
	email: string;
	created_at: string;
} | null;

export type Token = {
	id?: string;
} & JwtPayload;
