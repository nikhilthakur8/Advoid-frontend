import api from "@/api/api";
import { useUserContext } from "@/context/Context";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
	const { setUser } = useUserContext();
	const [loading, setLoading] = useState(true);
	async function fetchUserProfile() {
		setLoading(true);
		try {
			const resp = await api.get("user/profile");
			setUser(resp.data.user);
		} catch (error) {
			console.error("Error fetching user profile:", error);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		document.title = "DNS Filter - Manage your DNS filtering settings";
		fetchUserProfile();
	}, []);

	if (loading) {
		return (
			<div className="min-h-svh w-full bg-white dark:bg-neutral-950 text-white flex items-center justify-center px-5">
				Loading...
			</div>
		);
	}

	return (
		<div className="min-h-svh w-full bg-white dark:bg-neutral-950 text-white  px-5">
			<Outlet />
		</div>
	);
}
