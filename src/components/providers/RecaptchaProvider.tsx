"use client";
import { useEffect, useState } from "react";

interface RecaptchaProviderProps {
	children: React.ReactNode;
}

export const RecaptchaProvider = ({ children }: RecaptchaProviderProps) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// ✅ NAPRAWIONE: Ładuj reCAPTCHA od razu zamiast czekać na interakcję
		const loadRecaptcha = () => {
			if (document.querySelector('script[src*="recaptcha"]') || isLoaded) {
				return;
			}

			if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
				console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY nie jest ustawiony");
				return;
			}

			const script = document.createElement("script");
			script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
			script.async = true;
			script.defer = true;
			script.onload = () => {
				console.log("reCAPTCHA loaded successfully");
				setIsLoaded(true);
			};
			script.onerror = () => {
				console.error("Failed to load reCAPTCHA script");
			};

			document.head.appendChild(script);
		};

		// ✅ NAPRAWIONE: Ładuj od razu po mount
		loadRecaptcha();
	}, [isLoaded]);

	return <>{children}</>;
};
