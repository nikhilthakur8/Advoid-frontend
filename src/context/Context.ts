/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext } from "react";

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
};

type UserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => {},
});

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext };
