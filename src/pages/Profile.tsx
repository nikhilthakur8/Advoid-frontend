import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/Context";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export default function Profile() {
	const { user, setUser } = useUserContext();
	const navigate = useNavigate();

	function handleLogout() {
		localStorage.removeItem("ADVOID_SESSION");
		setUser(null);
		navigate("/login");
	}
	return (
		<div className="flex min-h-svh items-center justify-center flex-col">
			<h1 className="text-2xl font-bold mb-4">Profile Page</h1>
			<p>Name: {user?.name}</p>
			<p>Email: {user?.email}</p>
			<p>Role: {user?.role}</p>
			<Button
				className="mt-4 text-sm md:text-base"
				onClick={handleLogout}
			>
				Logout
				<LogOut />
			</Button>
		</div>
	);
}
