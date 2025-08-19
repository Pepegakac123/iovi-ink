// app/layout.tsx - DODAJ RecaptchaProvider
import type { Metadata } from "next";
import "./globals.css";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider"; // ← DODANE
import { Toaster } from "sonner"; // ← DODANE (dla toastów)

export const metadata: Metadata = {
	title: "Moja Aplikacja",
	description: "Opis aplikacji",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pl">
			<body className="bg-background">
				<RecaptchaProvider>
					{" "}
					{/* ← DODANE: Wrapper dla reCAPTCHA */}
					{children}
					<Toaster /> {/* ← DODANE: Toaster dla sonner */}
				</RecaptchaProvider>
			</body>
		</html>
	);
}
