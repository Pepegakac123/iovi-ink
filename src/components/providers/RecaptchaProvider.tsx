"use client";
import { useEffect, useState } from "react";

interface RecaptchaProviderProps {
	children: React.ReactNode;
}

export const RecaptchaProvider = ({ children }: RecaptchaProviderProps) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// ✅ Opóźnij ładowanie reCAPTCHA do interakcji użytkownika
		const loadRecaptcha = () => {
			if (document.querySelector('script[src*="recaptcha"]') || isLoaded)
				return;

			const script = document.createElement("script");
			script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
			script.async = true;
			script.defer = true;
			script.onload = () => setIsLoaded(true);

			document.head.appendChild(script);
		};

		// ✅ Ładuj na pierwsze hover/touch zamiast od razu
		const handleUserInteraction = () => {
			loadRecaptcha();
			// Remove listeners po załadowaniu
			["mousedown", "touchstart", "keydown"].forEach((event) => {
				document.removeEventListener(event, handleUserInteraction, true);
			});
		};

		// ✅ Dodaj listenery na interakcję
		["mousedown", "touchstart", "keydown"].forEach((event) => {
			document.addEventListener(event, handleUserInteraction, {
				once: true,
				passive: true,
				capture: true,
			});
		});

		return () => {
			["mousedown", "touchstart", "keydown"].forEach((event) => {
				document.removeEventListener(event, handleUserInteraction, true);
			});
		};
	}, [isLoaded]);

	return <>{children}</>;
};
