import { createRoot } from "react-dom/client";
import router from "@/routes/router";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")!).render(
	<ThemeProvider>
		<RouterProvider router={router} />
		<Toaster position="top-right" richColors />
	</ThemeProvider>
);
