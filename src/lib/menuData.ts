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
}

export interface ServiceDropdownProps {
	serviceKey: string;
	service: Service;
}

// Menu items data
export const menuItems: MenuItem[] = [
	{ name: "Strona główna", href: "/" },
	{ name: "Portfolio", href: "/portfolio" },
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
				href: "/uslugi/tatuaze/minimalistyczne",
			},
			{
				name: "Geometryczne",
				desc: "Precyzyjne wzory i kształty",
				icon: Layers3,
				href: "/uslugi/tatuaze/geometryczne",
			},
			{
				name: "Fine Line",
				desc: "Cienkie linie, szczegółowe",
				icon: Palette,
				href: "/uslugi/tatuaze/fine-line",
			},
		],
	},
};
