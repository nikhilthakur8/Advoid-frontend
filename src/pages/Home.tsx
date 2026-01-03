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
	const [copied, setCopied] = useState<"doh" | "dot" | "ipv4" | null>(null);

	function handleCopy(text: string, type: "doh" | "dot" | "ipv4") {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
		setCopied(type);

		setTimeout(() => setCopied(null), 2000);
	}

	const [isOpen, setIsOpen] = useState(false);

	function handleSelectChange(value: string) {
		const prompt = `Tell me how to configure DNS on ${value} using this following endpoints:\n\nDNS over IPV4 is 80.225.222.130\nDNS over HTTPS: ${
			userId ? `https://${userId}.dns.clouly.in` : "https://dns.clouly.in"
		}\nDNS over TLS: ${
			userId ? `${userId}.dns.clouly.in` : "dns.clouly.in"
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
								IPV4
							</p>
							<p className="text-base font-mono">
								{"80.225.222.130"}
							</p>
						</div>

						{copied === "ipv4" ? (
							<CopyCheck className="size-4 text-green-500" />
						) : (
							<Copy
								className="size-4 cursor-pointer text-muted-foreground hover:text-foreground transition"
								onClick={() =>
									handleCopy("80.225.222.130", "ipv4")
								}
							/>
						)}
					</div>

					{/* DNS over HTTPS */}
					<div className="flex items-center justify-between px-4 py-3">
						<div>
							<p className="text-sm text-muted-foreground">
								DNS over HTTPS
							</p>
							<p className="text-base font-mono">
								{userId
									? `https://dns.clouly.in/${userId}`
									: "https://dns.clouly.in"}
							</p>
						</div>

						{copied === "doh" ? (
							<CopyCheck className="size-4 text-green-500" />
						) : (
							<Copy
								className="size-4 cursor-pointer text-muted-foreground hover:text-foreground transition"
								onClick={() =>
									handleCopy(
										userId
											? `https://dns.clouly.in/${userId}`
											: "https://dns.clouly.in",
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
								{userId
									? `${userId}.dns.clouly.in`
									: "dns.clouly.in"}
							</p>
						</div>

						{copied === "dot" ? (
							<CopyCheck className="size-4 text-green-500" />
						) : (
							<Copy
								className="size-4 cursor-pointer text-muted-foreground hover:text-foreground transition"
								onClick={() =>
									handleCopy(
										userId
											? `${userId}.dns.clouly.in`
											: "dns.clouly.in",
										"dot"
									)
								}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
