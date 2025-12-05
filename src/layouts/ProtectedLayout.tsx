import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/Context";
import { Link, Outlet } from "react-router-dom";

export default function ProtectedLayout() {
	const { user } = useUserContext();
	const url = window.location.href;
	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen space-y-4">
				<h1 className="text-xl">Login to view this page.</h1>
				<div className="space-x-4 ">
					<Link to={"/login?redirect=" + encodeURIComponent(url)}>
						<Button className="text-sm md:text-base hover:scale-105 transition-transform">
							Login
						</Button>
					</Link>
					<Link to={"/register?redirect=" + encodeURIComponent(url)}>
						<Button className="text-sm md:text-base hover:scale-105 transition-transform">
							Register
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return <Outlet />;
}
