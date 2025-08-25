import type { Metadata } from "next";
import "./globals.css";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";
import { Toaster } from "sonner";
import Footer from "@/components/Sections/Footer";
import Navbar from "@/components/Navbar";
import { images } from "@/lib/images";
export const metadata: Metadata = {
	title: {
		template: "%s - bezpłatna konsultacja - iovi-ink",
		default: "Tatuaże - bezpłatna konsultacja - iovi-ink",
	},
	description:
		"Tatuaże graficzne i minimalistyczne w Mszanie Dolnej. Autorskie projekty, precyzja wykonania, - Bezpłatna konsultacja",
	keywords: [
		"tatuaże",
		// ✅ Z twojej keyword database - najwyższe priority
		"delikatne tatuaże damskie", // 8,100 vol - MEGA HIGH
		"tatuaże minimalistyczne", // 1,300 vol - HIGH
		"tatuaże na ręce", // 14,800 vol - HIGH
		"tatuażysta", // 2,400 vol - HIGH (używam "tatuażysta")
		"tatuaże fine line", // z bazy - HIGH
		"małe tatuaże damskie", // z bazy
		"subtelne tatuaże", // z content

		// ✅ Z realnego contentu data.ts
		"autorskie projekty tatuaże", // z whyMeHome
		"bezpłatna konsultacja tatuaż", // z proces[0]
		"precyzyjne wykonanie", // z content
		"tatuażystka mszana dolna", // local SEO
		"studio lewus ink", // work location
	],
	authors: [{ name: "Jowita - iovi-ink" }],

	openGraph: {
		title:
			"Jowita - Tatuaże graficzne i minimalistyczne | Lewus Ink Mszana Dolna",
		description:
			"Tatuaże graficzne i minimalistyczne w Mszanie Dolnej. Autorskie projekty, precyzja wykonania, - Bezpłatna konsultacja",
		url: "https://iovi-ink.pl",
		siteName: "iovi-ink",
		locale: "pl_PL",
		type: "website",
		images: [
			{
				url: `${images.seoBaner.src}`,
				width: 1200,
				height: 630,
				alt: `${images.seoBaner.alt}`,
			},
		],
	},
	// Geo targeting - KLUCZOWE dla Local SEO
	other: {
		"geo.region": "PL-12", // Małopolskie
		"geo.placename": "Mszana Dolna",
		"geo.position": "49.6754860;20.0798428", // Współrzędne Lewus Ink
		ICBM: "49.6754860, 20.0798428",
		robots: "index, follow, max-image-preview:large, max-snippet:140",
	},

	// Canonical URL
	metadataBase: new URL("https://iovi-ink.pl"),
	alternates: {
		canonical: "https://iovi-ink.pl",
	},

	// Additional meta tags
	category: "Art & Design",
	classification: "Tattoo Artist",
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
					<Navbar /> {/* ← DODANE: Wrapper dla reCAPTCHA */}
					{children}
					<Footer />
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
