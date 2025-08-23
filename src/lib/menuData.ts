// src/lib/menuData.ts
import type { LucideIcon } from "lucide-react";
import { Palette, Layers3, Zap, Sparkles } from "lucide-react";

// Types
export interface ServiceItem {
	name: string;
	desc: string;
	icon: LucideIcon;
	href: string;
}

export interface Service {
	title: string;
	icon: LucideIcon;
	items: ServiceItem[];
}

export interface MenuItem {
	name: string;
	href: string;
	hasDropdown?: boolean; // Nowe pole dla rozróżnienia
}

export interface ServiceDropdownProps {
	serviceKey: string;
	service: Service;
}

// Menu items data - ZMIENIONA KOLEJNOŚĆ
export const menuItems: MenuItem[] = [
	{ name: "Strona główna", href: "/" },
	{ name: "Portfolio", href: "/portfolio" },
	// Usługi będą wstawione tu jako dropdown
	{ name: "O Mnie", href: "/o-mnie" },
	{ name: "Kontakt", href: "/kontakt" },
];

// Pomocnicze tablice dla różnych części menu
export const menuItemsBeforeServices: MenuItem[] = [
	{ name: "Strona główna", href: "/" },
	{ name: "Portfolio", href: "/portfolio" },
];

export const menuItemsAfterServices: MenuItem[] = [
	{ name: "O Mnie", href: "/o-mnie" },
	{ name: "Kontakt", href: "/kontakt" },
];

export const FooterMenuLinks = [
	{ name: "Strona główna", href: "/" },
	{ name: "Portfolio", href: "/portfolio" },
	{ name: "Usługi", href: "/uslugi" },
	{ name: "O Mnie", href: "/o-mnie" },
	{ name: "Kontakt", href: "/kontakt" },
];

// Services data
export const services = {
	tatuaze: {
		title: "Tatuaże",
		icon: Zap,
		items: [
			{
				name: "Minimalistyczne",
				desc: "Delikatne, subtelne projekty",
				icon: Sparkles,
				href: "/uslugi/tatuaze-minimalistyczne",
			},
			{
				name: "Fine Line",
				desc: "Cienkie linie, szczegółowe",
				icon: Palette,
				href: "/uslugi/tatuaze-minimalistyczne",
			},
			{
				name: "Delikatne Tatuaże Damskie",
				desc: "Cienkie linie, szczegółowe",
				icon: Palette,
				href: "/uslugi/delikatne-tatuaze-damskie",
			},
		],
	},
};
