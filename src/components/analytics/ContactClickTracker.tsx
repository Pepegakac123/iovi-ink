"use client";

import { useEffect } from "react";
import { type LeadType, trackLead } from "@/lib/trackLead";

// Kliknięcia w kanały kontaktu → licznik leadów (panel WP) i GA4 — bez onClick w każdym przycisku.
// Miejsce kliknięcia: atrybut data-track-placement najbliższego przodka, inaczej id lub nagłówek sekcji.
const CHANNELS: { type: LeadType; match: (href: string) => boolean }[] = [
	{ type: "instagram", match: (h) => h.includes("instagram.com/iovi") },
	{ type: "email", match: (h) => h.startsWith("mailto:") },
	{ type: "telefon", match: (h) => h.startsWith("tel:") },
	{
		type: "trasa",
		match: (h) =>
			h.includes("google.com/maps") ||
			h.includes("maps.app.goo.gl") ||
			h.includes("share.google"),
	},
];

function placementOf(el: Element): string {
	const tagged = el.closest("[data-track-placement]");
	if (tagged) return tagged.getAttribute("data-track-placement") || "";
	if (el.closest("footer")) return "footer";
	if (el.closest("nav, header")) return "navbar";
	const section = el.closest("section");
	if (section?.id) return section.id;
	const heading = section?.querySelector("h1, h2");
	return heading?.textContent?.trim().slice(0, 60) || "unknown";
}

export default function ContactClickTracker() {
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const link = (e.target as Element | null)?.closest?.("a[href]");
			if (!link) return;
			const href = link.getAttribute("href") || "";
			const channel = CHANNELS.find((c) => c.match(href));
			if (channel) trackLead(channel.type, placementOf(link));
		};
		document.addEventListener("click", onClick, { capture: true });
		return () =>
			document.removeEventListener("click", onClick, { capture: true });
	}, []);

	return null;
}
