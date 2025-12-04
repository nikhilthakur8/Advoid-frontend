import { Loader } from "lucide-react";

export default function Loading({ text }: { text?: string }) {
	return (
		<div className="w-full h-full items-center flex justify-center">
			{<Loader className="animate-spin" />}
			{text && <span className="ml-2">{text}</span>}
		</div>
	);
}
