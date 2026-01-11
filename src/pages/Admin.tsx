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
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Admin() {
	type Logs = {
		_id: string;
		timestamp: string;
		domain: string;
		userId: string;
		type: string;
		action: boolean;
	};
	const token = localStorage.getItem("ADVOID_SESSION");
	const [logs, setLogs] = useState<Logs[]>([]);
	const [eventSource, setEventSource] = useState<EventSource | null>(null);
	const isThrottled = useRef(false);
	async function handleWatchLiveLogs() {
		if (isThrottled.current) {
			toast.error("Please wait a moment before trying again.");
			return;
		};
		isThrottled.current = true;
		const eventSource = new EventSource(
			`${import.meta.env.VITE_API_BASE_URL}/admin/watch-logs?token=${token}`
		);
		eventSource.onmessage = (event) => {
			const newLog = JSON.parse(event.data);
			console.log("New log received:", newLog);
			setLogs((prevLogs) => [newLog.log, ...prevLogs]);
		};
		eventSource.onopen = () => {
			toast.success("Connected! Watching live logs...");
			setEventSource(eventSource);
			isThrottled.current = false;
		};
		eventSource.onerror = (error) => {
			console.error("EventSource failed:", error);
			eventSource.close();
			setEventSource(null);
			toast.error("Connection lost. Please try again.");
		};
	}
	return (
		<div className="max-w-5xl mx-auto py-8 mt-10 space-y-6">
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
					disabled={!!eventSource}
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
							<TableHead>Action</TableHead>
							<TableHead>Time Stamp</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>User Id</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{logs.map((item, index) => (
							<TableRow key={item._id} className="*:px-4 *:py-3">
								<TableCell>{logs.length - index}.</TableCell>
								<TableCell className="max-w-sm break-all whitespace-normal">{item.domain}</TableCell>
								<TableCell>{item.action ? "Allowed" : "Blocked"}</TableCell>
								<TableCell>{new Date(item.timestamp).toDateString()}</TableCell>
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
