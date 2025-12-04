import { Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<div className="min-h-svh w-full bg-white dark:bg-neutral-950 text-white flex items-center justify-center px-5">
			<Outlet />
		</div>
	);
}
