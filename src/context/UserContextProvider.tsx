import { useState } from "react";
import { UserContext } from "./Context";

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
};

export default function UserContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}
