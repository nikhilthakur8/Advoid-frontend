import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/Context";

type FormData = {
	email: string;
	password: string;
};

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const navigate = useNavigate();
	const { setUser } = useUserContext();
	const urlParams = new URLSearchParams(window.location.search);
	const redirectUrl = urlParams.get("redirect") || "/dashboard";
	const [loading, setLoading] = useState(false);
	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			const response = await api.post("/auth/login", data);
			const token = response.data.token;
			const userData = response.data.user;
			setUser(userData);
			localStorage.setItem("ADVOID_SESSION", token);
			toast.success("Login successful!");
			navigate(redirectUrl);
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error("Login failed:", error.response?.data);
				toast.error(
					`Login failed: ${
						error.response?.data.message || error.message
					}`
				);
			} else {
				console.error("An unexpected error occurred:", error);
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-svh">
			<Card className="relative w-[400px] overflow-hidden">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Enter your credentials to access your account.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									{...register("email", {
										required: "Email is required",
									})}
								/>
								{errors.email && (
									<span className="text-red-500 text-sm">
										{errors.email.message}
									</span>
								)}
							</div>

							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									{...register("password", {
										required: "Password is required",
									})}
								/>
								{errors.password && (
									<span className="text-red-500 text-sm">
										{errors.password.message}
									</span>
								)}
							</div>

							<Button
								type="submit"
								className="w-full mt-2"
								disabled={loading}
							>
								{loading ? (
									<Loading text="Logging in..." />
								) : (
									"Login"
								)}
							</Button>
						</div>
					</form>
				</CardContent>

				<CardFooter className="flex justify-center">
					<Button variant="outline" asChild>
						<Link to="/register">
							Don’t have an account? Register
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
