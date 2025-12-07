import AllowList from "@/components/AllowList";
import DenyList from "@/components/DenyList";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/Context";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
	const { setUser } = useUserContext();
	const [active, setActive] = useState<"denyList" | "allowList">("denyList");
	const navigate = useNavigate();
	function handleLogout() {
		localStorage.removeItem("ADVOID_SESSION");
		setUser(null);
		navigate("/login");
	}
	return (
		<div className="w-full my-4">
			<div className="flex sticky top-5 right-5  w-full justify-end items-center mb-4 space-x-2">
				<Link to={"/profile"}>
					<Button>
						<User />
						Profile
					</Button>
				</Link>
				<Button variant={"destructive"} onClick={handleLogout}>
					Logout
					<LogOut />
				</Button>
			</div>
			<div className="flex items-center max-w-3xl mx-auto justify-center flex-col gap-5 mt-10">
				<div className="ml-auto">
					<Button
						variant={active === "denyList" ? "default" : "outline"}
						className="mr-2"
						onClick={() => setActive("denyList")}
					>
						Deny List
					</Button>
					<Button
						variant={active === "allowList" ? "default" : "outline"}
						onClick={() => setActive("allowList")}
					>
						Allow List
					</Button>
				</div>
				{active === "denyList" ? <DenyList /> : <AllowList />}
			</div>
		</div>
	);
}
