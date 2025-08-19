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
					<Toaster
						position="top-right"
						duration={5000}
						expand={true}
						richColors={false}
						closeButton={true}
						toastOptions={{
							duration: 5000,
							style: {
								background: "var(--background)",
								border: "2px solid var(--foreground)",
								borderBottomWidth: "4px",
								borderRightWidth: "4px",
								borderRadius: "0.5rem",
								padding: "1rem",
								fontFamily: "var(--font-text)",
								color: "var(--foreground)",
								boxShadow: "4px 4px 0px 0px var(--foreground)",
								fontSize: "0.875rem",
								fontWeight: "500",
							},
							classNames: {
								toast: "group toast group-[.toaster]:shadow-lg",
								title:
									"text-foreground font-primary font-bold text-sm uppercase tracking-wide",
								description: "text-foreground font-text text-xs opacity-90",
								actionButton:
									"group-[.toast]:bg-primary group-[.toast]:text-background group-[.toast]:border-2 group-[.toast]:border-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:font-primary group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:text-xs group-[.toast]:hover:bg-accent group-[.toast]:hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
								cancelButton:
									"group-[.toast]:bg-secondary group-[.toast]:text-foreground group-[.toast]:border-2 group-[.toast]:border-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:font-primary group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:text-xs group-[.toast]:hover:bg-muted group-[.toast]:hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
								closeButton:
									"group-[.toast]:bg-secondary group-[.toast]:text-foreground group-[.toast]:border-2 group-[.toast]:border-foreground group-[.toast]:rounded group-[.toast]:hover:bg-muted group-[.toast]:hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
								success:
									"group-[.toaster]:border-primary group-[.toaster]:shadow-[4px_4px_0px_0px_var(--primary)]",
								error:
									"group-[.toaster]:border-destructive group-[.toaster]:shadow-[4px_4px_0px_0px_var(--destructive)]",
								warning:
									"group-[.toaster]:border-accent group-[.toaster]:shadow-[4px_4px_0px_0px_var(--accent)]",
								info: "group-[.toaster]:border-accent group-[.toaster]:shadow-[4px_4px_0px_0px_var(--accent)]",
							},
						}}
						// Custom styling for different types
						style={{
							fontFamily: "var(--font-text)",
						}}
					/>
				</RecaptchaProvider>
			</body>
		</html>
	);
}
