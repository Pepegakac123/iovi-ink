// Lokalne strony "tatuaże {miasto}" — zostaje 6 hubów z realnym popytem (DataForSEO, 2026-10).
// Pozostałe miejscowości przekierowują (301) do najbliższego huba i są wymienione w jego sekcji dojazdu.
// /tatuazysta/tatuazysta-{miasto} dublowały /tatuaze/* (~50% wspólnej treści), więc też przekierowują.

export type CityHub = {
	name: string;
	/** dopełniacz do nagłówka "dojazd z …" */
	fromName: string;
	nearby: { slug: string; name: string }[];
};

export const CITY_HUBS: Record<string, CityHub> = {
	"mszana-dolna": {
		name: "Mszana Dolna",
		fromName: "Mszany Dolnej",
		nearby: [
			{ slug: "dobra", name: "Dobra" },
			{ slug: "kamienica", name: "Kamienica" },
			{ slug: "krakow", name: "Kraków" },
		],
	},
	limanowa: {
		name: "Limanowa",
		fromName: "Limanowej",
		nearby: [
			{ slug: "slopnice", name: "Słopnice" },
			{ slug: "laskowa", name: "Laskowa" },
		],
	},
	myslenice: {
		name: "Myślenice",
		fromName: "Myślenic",
		nearby: [
			{ slug: "dobczyce", name: "Dobczyce" },
			{ slug: "siepraw", name: "Siepraw" },
			{ slug: "sulkowice", name: "Sułkowice" },
			{ slug: "pcim", name: "Pcim" },
			{ slug: "tokarnia", name: "Tokarnia" },
			{ slug: "lubien", name: "Lubień" },
			{ slug: "gdow", name: "Gdów" },
		],
	},
	rabka: {
		name: "Rabka-Zdrój",
		fromName: "Rabki-Zdroju",
		nearby: [
			{ slug: "raba-wyzna", name: "Raba Wyżna" },
			{ slug: "jordanow", name: "Jordanów" },
			{ slug: "spytkowice", name: "Spytkowice" },
			{ slug: "sidzina", name: "Sidzina" },
			{ slug: "makow-podhalanski", name: "Maków Podhalański" },
		],
	},
	"nowy-targ": { name: "Nowy Targ", fromName: "Nowego Targu", nearby: [] },
	"nowy-sacz": { name: "Nowy Sącz", fromName: "Nowego Sącza", nearby: [] },
};

export const HUB_SLUGS = Object.keys(CITY_HUBS);

/** slug miejscowości (bez prefiksu) -> slug huba */
export function hubForCity(city: string): string | undefined {
	if (CITY_HUBS[city]) return city;
	return HUB_SLUGS.find((hub) =>
		CITY_HUBS[hub].nearby.some((town) => town.slug === city),
	);
}

/** Przekierowania 301 dla next.config.ts */
export function cityRedirects() {
	const cities = [
		...HUB_SLUGS,
		...HUB_SLUGS.flatMap((hub) => CITY_HUBS[hub].nearby.map((t) => t.slug)),
	];
	const toHub = (city: string) => `/tatuaze/tatuaze-${hubForCity(city)}`;
	return [
		...cities.map((city) => ({
			source: `/tatuazysta/tatuazysta-${city}`,
			destination: toHub(city),
			permanent: true,
		})),
		...cities
			.filter((city) => !CITY_HUBS[city])
			.map((city) => ({
				source: `/tatuaze/tatuaze-${city}`,
				destination: toHub(city),
				permanent: true,
			})),
	];
}
