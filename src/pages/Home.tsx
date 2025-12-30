import { useUserContext } from "@/context/Context";
import { ChevronDown, Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
	const { user } = useUserContext();
	const userId = user?.id;

	const [copied, setCopied] = useState<"doh" | "dot" | null>(null);

	function handleCopy(text: string, type: "doh" | "dot") {
		if (!userId) return;

		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
		setCopied(type);

		setTimeout(() => setCopied(null), 2000);
	}

	const [isOpen, setIsOpen] = useState(false);

	function handleSelectChange(value: string) {
		const prompt = `Tell me how to configure DNS on ${value} for DNS over HTTPS and DNS over TLS using this following endpoints:\n\nDNS over HTTPS: https://dns.clouly.in/${
			userId ? userId : ""
		}\nDNS over TLS: dns.clouly.in/${
			userId ? userId : ""
		}\n\nProvide step-by-step instructions.`;
		const encodedPrompt = encodeURIComponent(prompt);
		const url = `https://chat.openai.com/?prompt=${encodedPrompt}`;
		window.open(url, "_blank");
	}

	return (
		<div className="flex min-h-svh items-center justify-center">
			<div className="w-full max-w-md rounded-xl border bg-background shadow-sm">
				<div>
					<h2 className="px-4 py-3 border-b text-sm font-semibold">
						DNS Endpoints
					</h2>
					<div>
						<DropdownMenu onOpenChange={setIsOpen}>
							<DropdownMenuTrigger asChild>
								{/* Using asChild is cleaner when you have a custom styled trigger */}
								<button className="w-full text-left px-4 py-2 border-b hover:bg-muted cursor-pointer flex items-center justify-between focus:outline-none">
									<span className="text-sm text-muted-foreground">
										Get Setup Instructions
									</span>
									<ChevronDown
										className={`size-4 text-muted-foreground transition-transform duration-200 ${
											isOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								align="start"
								style={{
									width: "var(--radix-dropdown-menu-trigger-width)",
								}}
							>
								{[
									"Browser",
									"Android",
									"macOS",
									"iOS",
									"Linux",
									"Router",
									"Windows",
								].map((item) => (
									<DropdownMenuItem
										key={item}
										onClick={() => handleSelectChange(item)}
										className="cursor-pointer text-base"
									>
										{item}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="divide-y">
					{/* DNS over HTTPS */}
					<div className="flex items-center justify-between px-4 py-3">
						<div>
							<p className="text-sm text-muted-foreground">
								DNS over HTTPS
							</p>
							<p className="text-base font-mono">
								https://dns.clouly.in/{userId}
							</p>
						</div>

						{copied === "doh" ? (
							<CopyCheck className="size-4 text-green-500" />
						) : (
							<Copy
								className="size-4 cursor-pointer text-muted-foreground hover:text-foreground transition"
								onClick={() =>
									handleCopy(
										`https://dns.clouly.in/${userId}`,
										"doh"
									)
								}
							/>
						)}
					</div>

					{/* DNS over TLS */}
					<div className="flex items-center justify-between px-4 py-3">
						<div>
							<p className="text-sm text-muted-foreground">
								DNS over TLS
							</p>
							<p className="text-base font-mono">
								dns.clouly.in/{userId}
							</p>
						</div>

						{copied === "dot" ? (
							<CopyCheck className="size-4 text-green-500" />
						) : (
							<Copy
								className="size-4 cursor-pointer text-muted-foreground hover:text-foreground transition"
								onClick={() =>
									handleCopy(`dns.clouly.in/${userId}`, "dot")
								}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
