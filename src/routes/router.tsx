import ProtectedLayout from "@/layouts/ProtectedLayout";
import RootLayout from "@/layouts/RootLayout";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{ index: true, element: <Home /> },
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/",
				element: <ProtectedLayout />,
				children: [
					{
						path: "/profile",
						element: <Profile />,
					},
					{
						path: "/dashboard",
						element: <Dashboard />,
					},
				],
			},
		],
	},
	{
		path: "/",
		children: [],
	},
]);

export default router;
