// src/lib/fonts.ts
import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
	subsets: ["latin", "latin-ext"],
	display: "swap",
	preload: true,
	variable: "--font-text",
	weight: ["400", "500", "600", "700"],
});

// ✅ AlfaSlabOne lokalnie - optimized loading
export const alfaSlabOne = localFont({
	src: "../../public/fonts/AlfaSlabOne-Regular.woff2",
	display: "swap",
	preload: true,
	variable: "--font-primary",
	weight: "400",
});
console.log("AlfaSlabOne", alfaSlabOne);
// ✅ Export for easy usage
export const fontVariables = `${inter.variable} ${alfaSlabOne.variable}`;
