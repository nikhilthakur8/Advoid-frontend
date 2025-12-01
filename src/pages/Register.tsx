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
import { toast } from "sonner";
import { isAxiosError } from "axios";

type FormData = {
	name: string;
	email: string;
	password: string;
};

export default function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const navigate = useNavigate();

	async function onSubmit(data: FormData) {
		try {
			await api.post("/auth/register", data);
			toast.success("Registration successful! Please log in.");
			navigate("/login");
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error("Registration failed:", error.response?.data);
				toast.error(
					`Registration failed: ${
						error.response?.data.message || error.message
					}`
				);
			} else {
				console.error("Registration failed:", error);
				toast.error("Registration failed. Please try again.");
			}
		}
	}
	return (
		<Card className="relative w-[400px] overflow-hidden">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>
					Create an account to get started.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter your full name"
								{...register("name", {
									required: "Full name is required",
								})}
							/>
							{errors.name && (
								<span className="text-red-500 text-sm">
									{errors.name.message}
								</span>
							)}
						</div>

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
								placeholder="Choose a password"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message:
											"Password must be at least 6 characters",
									},
								})}
							/>
							{errors.password && (
								<span className="text-red-500 text-sm">
									{errors.password.message}
								</span>
							)}
						</div>

						<Button type="submit" className="w-full mt-2">
							Register
						</Button>
					</div>
				</form>
			</CardContent>

			<CardFooter className="flex justify-center">
				<Button variant="outline" asChild>
					<Link to="/login">Already have an account? Login</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
