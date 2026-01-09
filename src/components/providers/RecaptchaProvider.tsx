// src/components/providers/RecaptchaProvider.tsx
// --- REKOMENDOWANA WERSJA Z next/script ---
"use client";

import React from "react";
import Script from "next/script";

interface RecaptchaProviderProps {
	children: React.ReactNode;
}

// Upewnij się, że klucz jest poprawnie odczytywany
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export const RecaptchaProvider: React.FC<RecaptchaProviderProps> = ({
	children,
}) => {
	const [shouldLoad, setShouldLoad] = React.useState(false);

	React.useEffect(() => {
		const handleInteraction = () => {
			setShouldLoad(true);
		};

		// Lista zdarzeń, które triggerują ładowanie ReCAPTCHA
		const events = ["scroll", "click", "keydown", "mousemove", "touchstart"];

		// Dodajemy nasłuchiwanie
		for (const event of events) {
			window.addEventListener(event, handleInteraction, { once: true });
		}

		return () => {
			for (const event of events) {
				window.removeEventListener(event, handleInteraction);
			}
		};
	}, []);

	if (!siteKey) {
		console.error(
			"BŁĄD: Brak klucza NEXT_PUBLIC_RECAPTCHA_SITE_KEY w .env. Formularz kontaktowy nie będzie działać poprawnie.",
		);
		return <>{children}</>;
	}

	return (
		<>
			{shouldLoad && (
				<Script
					id="google-recaptcha-script"
					src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
					strategy="afterInteractive"
					onLoad={() => {
						console.log("✅ Skrypt Google reCAPTCHA załadowany pomyślnie.");
					}}
					onError={(e) => {
						console.error("❌ Krytyczny błąd ładowania skryptu reCAPTCHA:", e);
					}}
				/>
			)}
			{children}
		</>
	);
};
