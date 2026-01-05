import { Button } from "@/components/ui/button";
import {
	TableHeader,
	TableRow,
	Table,
	TableBody,
	TableCell,
	TableHead,
} from "@/components/ui/table";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
	type Logs = {
		_id: string;
		timestamp: string;
		domain: string;
		userId: string;
		type: string;
		action: string;
	};
	const token = localStorage.getItem("ADVOID_SESSION");
	const [logs, setLogs] = useState<Logs[]>([]);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);
	async function handleWatchLiveLogs() {
		const eventSource = new EventSource(
			`${import.meta.env.VITE_API_BASE_URL}admin/watch-logs`
		);
		eventSource.onmessage = (event) => {
			const newLog = JSON.parse(event.data);
			setLogs((prevLogs) => [newLog.log, ...prevLogs]);
		};
		eventSource.onopen = () => {
			toast.success("Connected! Watching live logs...");
			setEventSource(eventSource);
		};
		eventSource.onerror = (error) => {
			console.error("EventSource failed:", error);
			eventSource.close();
			setEventSource(null);
			toast.error("Connection lost. Please try again.");
		};
	}
	return (
		<div className="max-w-4xl mx-auto py-8 mt-10 space-y-6">
			<div>
				<p>Your Admin Access Token is :</p>
				<p
					className="break-all w-fit active:select-all border p-2 rounded mt-2"
					onClick={() => {
						navigator.clipboard.writeText(token || "");
						toast.success("Copied to clipboard!");
					}}
				>
					{token}
				</p>
			</div>
			<div className="text-right">
				<Button
					onClick={handleWatchLiveLogs}
					className={`${
						eventSource ? "bg-green-500 text-white" : ""
					}`}
				>
					{eventSource ? (
						<div className="flex items-center justify-center space-x-2">
							<Loader className="animate-spin" />
							<span> Live</span>
						</div>
					) : (
						"Watch Live Logs"
					)}
				</Button>
			</div>
			<div>
				<Table className="border w-full text-base ">
					<TableHeader>
						<TableRow className="*:px-4 *:py-3">
							<TableHead className="w-10">Index</TableHead>
							<TableHead>Domain</TableHead>
							<TableHead>Time Stamp</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>User Id</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{logs.map((item, index) => (
							<TableRow key={item._id} className="*:px-4 *:py-3">
								<TableCell>{index + 1}</TableCell>
								<TableCell>{item.domain}</TableCell>
								<TableCell>{item.timestamp}</TableCell>
								<TableCell>{item.type}</TableCell>
								<TableCell>{item.userId}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
