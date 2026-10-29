"use client";
import { useState, useEffect } from "react";

const CONSENT_EVENT = "cookie-consent-change";

export const useCookieConsent = () => {
	const [hasConsent, setHasConsent] = useState<boolean | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		// Sprawdź localStorage tylko po mount
		const read = () => {
			const consent = localStorage.getItem("cookie-consent");
			setHasConsent(
				consent === "accepted" ? true : consent === "declined" ? false : null,
			);
		};
		read();

		// Każdy komponent ma własną instancję hooka — zgoda z banera musi dotrzeć
		// do GA4ConditionalAnalytics bez przeładowania strony.
		window.addEventListener(CONSENT_EVENT, read);
		return () => window.removeEventListener(CONSENT_EVENT, read);
	}, []);

	const save = (value: "accepted" | "declined") => {
		localStorage.setItem("cookie-consent", value);
		window.dispatchEvent(new Event(CONSENT_EVENT));
	};

	const acceptCookies = () => save("accepted");

	const declineCookies = () => save("declined");

	return {
		hasConsent,
		acceptCookies,
		declineCookies,
		// TUTAJ: isLoading zależy tylko od mounted
		isLoading: !mounted,
	};
};
