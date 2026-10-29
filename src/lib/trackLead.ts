import { sendGAEvent } from "@next/third-parties/google";

export type LeadType = "formularz" | "instagram" | "email" | "telefon" | "trasa";

const GA_EVENTS: Record<LeadType, string> = {
	formularz: "generate_lead",
	instagram: "contact_instagram",
	email: "contact_email",
	telefon: "contact_phone",
	trasa: "contact_directions",
};

/**
 * Zdarzenie kontaktu: zawsze do własnego licznika (/api/lead-event → panel WP "Leady" + mail),
 * a do GA4 tylko po zgodzie na cookies (bez zgody dataLayer nie istnieje).
 */
export function trackLead(
	type: LeadType,
	placement: string,
	extra: Record<string, string | number | boolean> = {},
) {
	const page_path = window.location.pathname;
	const payload = JSON.stringify({
		type,
		placement,
		page_path,
		referrer: document.referrer ? new URL(document.referrer).hostname : "",
	});
	// sendBeacon przeżyje przejście na instagram.com; fetch keepalive jako zapas.
	const sent =
		typeof navigator.sendBeacon === "function" &&
		navigator.sendBeacon(
			"/api/lead-event",
			new Blob([payload], { type: "application/json" }),
		);
	if (!sent) {
		fetch("/api/lead-event", {
			method: "POST",
			body: payload,
			keepalive: true,
			headers: { "Content-Type": "application/json" },
		}).catch(() => {});
	}

	if ("dataLayer" in window) {
		sendGAEvent("event", GA_EVENTS[type], { page_path, placement, ...extra });
	}
}
