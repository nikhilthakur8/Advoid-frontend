/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "@/api/api";

import { Button } from "@/components/ui/button";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type DenyListItem = {
	domain: string;
	id: number;
	active: boolean;
};

export default function DenyList() {
	const [denyList, setDenyList] = useState<DenyListItem[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [domain, setDomain] = useState("");

	async function fetchDenyList() {
		try {
			const response = await api.get("user/deny-list");
			setDenyList(response.data.denyList);
		} catch (error) {
			console.log("Error fetching deny list:", error);
		}
	}
	useEffect(() => {
		fetchDenyList();
	}, []);

	async function handleAdd() {
		if (!domain.trim()) return;

		setLoading(true);
		try {
			const resp = await api.post("user/deny-list", {
				domain,
			});

			setDomain("");
			setOpen(false);
			setDenyList((prev) => [resp.data.data, ...prev]);
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error("Error adding deny item:", error.response?.data);
				toast.error(
					`Error adding deny item: ${
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
	}

	async function handleDelete(id: number) {
		setLoading(true);
		try {
			await api.delete(`user/deny-list/${id}`);
			setDenyList((prev) => prev.filter((item) => item.id !== id));
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error(
					"Error deleting deny item:",
					error.response?.data
				);
				toast.error(
					`Error deleting deny item: ${
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
	}

	async function handleUpdate(id: number, active: boolean) {
		setLoading(true);
		try {
			await api.patch(`user/deny-list/${id}`, {
				active: !active,
			});
			setDenyList((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, active: !active } : item
				)
			);
		} catch (error: unknown) {
			if (isAxiosError(error)) {
				console.error(
					"Error updating deny item:",
					error.response?.data
				);
				toast.error(
					`Error updating deny item: ${
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
	}

	return (
		<div className="max-w-3xl min-h-svh w-full mx-auto py-10 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold">My Deny List</h1>
				<Button
					onClick={() => setOpen(true)}
					className="text-sm md:text-base cursor-pointer"
					disabled={loading}
				>
					Add Domain
				</Button>
			</div>

			{denyList.length === 0 ? (
				<p className="text-muted-foreground text-sm">
					No denied items found.
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
						{denyList.map((item, index) => (
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
										className="hover:scale-105 cursor-pointer"
										size="sm"
										onClick={() =>
											handleUpdate(item.id, item.active)
										}
									>
										{item.active ? "Disable" : "Enable"}
									</Button>
									<Button
										disabled={loading}
										variant="destructive"
										className="hover:scale-105 cursor-pointer"
										size="sm"
										onClick={() => handleDelete(item.id)}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-md text-sm md:text-base">
					<DialogHeader>
						<DialogTitle className="text-base md:text-lg">
							Add a Domain
						</DialogTitle>
						<DialogDescription>
							Add a domain to your deny list.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<Label className="text-base md:text-lg">Domain</Label>
						<Input
							value={domain}
							onChange={(e) => setDomain(e.target.value)}
							placeholder="example.com"
						/>
					</div>

					<DialogFooter>
						<Button
							disabled={loading}
							className="text-sm md:text-base"
							onClick={handleAdd}
						>
							{loading ? <Loading text="Adding" /> : "Add Domain"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
