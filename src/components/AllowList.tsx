/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "@/api/api";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import Loading from "./Loading";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

type AllowListItem = {
	domain: string;
	id: number;
	active: boolean;
};

export default function AllowList() {
	const [allowList, setAllowList] = useState<AllowListItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [intialLoading, setIntialLoading] = useState(true);
	const [domain, setDomain] = useState("");

	async function fetchAllowList() {
		setIntialLoading(true);
		try {
			const response = await api.get("user/allow-list");
			setAllowList(response.data.allowList);
		} catch (error) {
			console.log("Error fetching allow list:", error);
		} finally {
			setIntialLoading(false);
		}
	}
	useEffect(() => {
		fetchAllowList();
	}, []);

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		if (!domain.trim()) return;

		setAddLoading(true);
		try {
			const resp = await api.post("user/allow-list", {
				domain,
			});

			setDomain("");
			setAllowList((prev) => [resp.data.data, ...prev]);
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error("Error adding allow item:", error.response?.data);
				toast.error(error.response?.data.message || error.message);
			} else {
				console.error("An unexpected error occurred:", error);
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setAddLoading(false);
		}
	}

	async function handleDelete(id: number) {
		setLoading(true);
		try {
			await api.delete(`user/allow-list/${id}`);
			setAllowList((prev) => prev.filter((item) => item.id !== id));
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error(
					"Error deleting allow item:",
					error.response?.data
				);
				toast.error(error.response?.data.message || error.message);
			} else {
				console.error("An unexpected error occurred:", error);
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdate(id: number, active: boolean) {
		setLoading(true);
		try {
			await api.patch(`user/allow-list/${id}`, {
				active: !active,
			});
			setAllowList((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, active: !active } : item
				)
			);
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error(
					"Error updating allow item:",
					error.response?.data
				);
				toast.error(error.response?.data.message || error.message);
			} else {
				console.error("An unexpected error occurred:", error);
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-3xl w-full mx-auto space-y-5">
			<div className="flex justify-between items-center">
				<form
					onSubmit={(e) => handleAdd(e)}
					className="w-full flex items-center space-x-2"
				>
					<Input
						value={domain}
						onChange={(e) => setDomain(e.target.value)}
						disabled={addLoading}
						placeholder="example.com"
					/>
					<Button type="submit" disabled={addLoading}>
						{addLoading ? <Loading text="Adding" /> : "Add"}
					</Button>
				</form>
			</div>
			{intialLoading ? (
				<div className="space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="flex items-center justify-between border p-4 rounded-lg"
						>
							<Skeleton className="h-5 w-10" /> {/* Index */}
							<Skeleton className="h-5 w-40" /> {/* Domain */}
							<Skeleton className="h-8 w-24" /> {/* Actions */}
						</div>
					))}
				</div>
			) : allowList.length === 0 ? (
				<p className="text-muted-foreground text-sm">
					No allowed items found.
				</p>
			) : (
				<Table className="border w-full text-base ">
					<TableHeader>
						<TableRow className="*:px-4 *:py-3">
							<TableHead className="w-10">Index</TableHead>
							<TableHead>Domain</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{allowList.map((item, index) => (
							<TableRow key={item.id} className="*:px-4 *:py-3">
								<TableCell>{index + 1}</TableCell>
								<TableCell className="font-medium">
									*.{item.domain}
								</TableCell>
								<TableCell className="text-right space-x-2">
									<Button
										disabled={loading}
										variant={
											item.active ? "outline" : "default"
										}
										onClick={() =>
											handleUpdate(item.id, item.active)
										}
										size="sm"
									>
										{item.active ? "Disable" : "Enable"}
									</Button>
									<Button
										disabled={loading}
										variant="destructive"
										onClick={() => handleDelete(item.id)}
										size="sm"
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
