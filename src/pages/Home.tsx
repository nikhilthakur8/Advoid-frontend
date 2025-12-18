import { useUserContext } from "@/context/Context";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
	const { user } = useUserContext();
	const userId = user?.id;

	const [copied, setCopied] = useState<"doh" | "dot" | null>(null);

	function handleCopy(text: string, type: "doh" | "dot") {
		if (!userId) return;

		navigator.clipboard.writeText(text);
		toast.info("Copied to clipboard!");
		setCopied(type);

		setTimeout(() => setCopied(null), 2000);
	}

	return (
		<div className="min-h-screen flex items-center justify-center ">
			<div className="w-full max-w-md rounded-xl border bg-background shadow-sm">
				<h2 className="px-4 py-3 border-b text-xl font-semibold">
					DNS Endpoints
				</h2>

				<div className="divide-y">
					{/* DNS over HTTPS */}
					<div className="flex items-center justify-between px-4 py-3">
						<div>
							<p className="text-sm text-muted-foreground">
								DNS over HTTPS
							</p>
							<p className="text-lg font-mono">
								https://dns.clouly.in/{userId}
							</p>
						</div>

						{copied === "doh" ? (
							<CopyCheck className="size-5 text-green-500" />
						) : (
							<Copy
								className="size-5 cursor-pointer text-muted-foreground hover:text-foreground transition"
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
							<p className="text-lg font-mono">
								dns.clouly.in/{userId}
							</p>
						</div>

						{copied === "dot" ? (
							<CopyCheck className="size-5 text-green-500" />
						) : (
							<Copy
								className="size-5 cursor-pointer text-muted-foreground hover:text-foreground transition"
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
