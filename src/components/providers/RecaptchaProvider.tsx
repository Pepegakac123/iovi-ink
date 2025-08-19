// components/providers/RecaptchaProvider.tsx
"use client";

import { useEffect } from "react";

interface RecaptchaProviderProps {
	children: React.ReactNode;
}

export const RecaptchaProvider = ({ children }: RecaptchaProviderProps) => {
	useEffect(() => {
		// Sprawdź czy skrypt już istnieje
		if (document.querySelector('script[src*="recaptcha"]')) {
			return;
		}

		// Dodaj skrypt reCAPTCHA v3
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
		script.async = true;
		script.defer = true;

		script.onload = () => {
			console.log("reCAPTCHA v3 loaded successfully");
		};

		script.onerror = () => {
			console.error("Failed to load reCAPTCHA v3");
		};

		document.head.appendChild(script);

		// Cleanup function
		return () => {
			const existingScript = document.querySelector('script[src*="recaptcha"]');
			if (existingScript) {
				document.head.removeChild(existingScript);
			}
		};
	}, []);

	return <>{children}</>;
};
