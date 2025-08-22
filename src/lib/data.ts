import { PROCESS_ICONS } from "@/lib/icons";
import { images } from "./images";

export const proces = [
	{
		id: 1,
		icon: PROCESS_ICONS.chat,
		bg_image: {
			mobile: images.proces.proces_1.mobile,
			desktop: images.proces.proces_1.desktop,
			alt: images.proces.proces_1.alt,
		},
		title: "Bezpłatna konsultacja",
		description:
			"Opowiadasz o swojej wizji, pokazujesz referencje, wyjaśniasz oczekiwania. Ja zadaję pytania, żeby zrozumieć istotę projektu.",
	},
	{
		id: 2,
		icon: PROCESS_ICONS.tabletGraphic,
		bg_image: {
			mobile: images.proces.proces_2.mobile,
			desktop: images.proces.proces_2.desktop,
			alt: images.proces.proces_2.alt,
		},
		title: "Szkicowanie autorskiego projektu",
		description:
			"Na podstawie rozmowy tworzę indywidualny design. Każdy szkic jest unikalny, dostosowany do Twoich potrzeb i anatomii.",
	},
	{
		id: 3,
		icon: PROCESS_ICONS.diamond,
		bg_image: {
			mobile: images.proces.proces_3.mobile,
			desktop: images.proces.proces_3.desktop,
			alt: images.proces.proces_3.alt,
		},
		title: "Dopracowanie szczegółów",
		description:
			"Pokazuję szkic, słucham uwag, wprowadzam zmiany. Dopracowujemy wszystko, aż będziesz pewny że to jest dokładnie to, czego chcesz.",
	},
	{
		id: 4,
		icon: PROCESS_ICONS.careForDetails,
		bg_image: {
			mobile: images.proces.proces_4.mobile,
			desktop: images.proces.proces_4.desktop,
			alt: images.proces.proces_4.alt,
		},
		title: "Profesjonalne wykonanie",
		description:
			"Sesja przebiega spokojnie i w Twoim tempie. Każda linia wykonana z maksymalną precyzją i troską o komfort.",
	},
	{
		id: 5,
		icon: PROCESS_ICONS.bandage,
		bg_image: {
			mobile: images.proces.proces_5.mobile,
			desktop: images.proces.proces_5.desktop,
			alt: images.proces.proces_5.alt,
		},
		title: "Wsparcie podczas gojenia",
		description:
			"Dostajesz instrukcje pielęgnacji i możesz się kontaktować z pytaniami przez cały okres gojenia. To część usługi.",
	},
];
export const homeFAQ = [
	{
		id: 1,
		question: "Ile czasu zajmuje wykonanie?",
		answer:
			"Małe projekty to 1-2 godziny, większe mogą wymagać kilku sesji. Wszystko zależy od złożoności i Twojej wytrzymałości.",
	},
	{
		id: 2,
		question: "Czy pierwsza rozmowa jest płatna?",
		answer:
			"Małe projekty to 1-2 godziny, większe mogą wymagać kilku sesji. Wszystko zależy od złożoności i Twojej wytrzymałości.",
	},
	{
		id: 3,
		question: "Jak przebiega gojenie tatuażu?",
		answer:
			"Małe projekty to 1-2 godziny, większe mogą wymagać kilku sesji. Wszystko zależy od złożoności i Twojej wytrzymałości.",
	},
	{
		id: 4,
		question: "Czy robisz poprawki starych tatuaży?",
		answer:
			"Małe projekty to 1-2 godziny, większe mogą wymagać kilku sesji. Wszystko zależy od złożoności i Twojej wytrzymałości.",
	},
];

export const aboutMeHome = {
	title: "Moje Doświadczenie w Tworzeniu Tatuaży",
	subheadline: "2 lata intensywnej nauki",
	image: images.zblizenie_na_twarz_patrzy_na_wprost,
	description: [
		"Artystyczne wykształcenie to fundament, ale prawdziwa nauka zaczęła się w studio. Każdy dzień to nowe wyzwania – różne typy skóry, różne oczekiwania klientów, różne techniki",
		"Studio Lewus Ink pozwala mi oferować tatuaże na najwyższym poziomie. Sterylne środowisko, profesjonalny sprzęt, komfortowe warunki. Mogę skupić się na sztuce, bo wszystko inne jest dopięte",
		"Każdy tatuaż traktuję jak wyzwanie artystyczne. Nie ma rutyny – jest ciągłe doskonalenie techniki i poszukiwanie najlepszych rozwiązań.",
	],
};

export const socialLinks = {
	iovi: {
		instagram: "https://www.instagram.com/iovi.ink/",
	},
	lewus: {
		googleMaps: "https://share.google/lc156tUkL2CVSgy2m",
		googleMapsView: "https://maps.app.goo.gl/kBFjCk4v8GGxi3mM9",
		instagram: "https://www.instagram.com/lewus_ink/",
	},
};
