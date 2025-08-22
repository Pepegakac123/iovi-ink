import { ICONS, PROCESS_ICONS } from "@/lib/icons";
import { images } from "./images";
import {
	AboutMeProps,
	ContactProps,
	FaqProps,
	FaqQuestion,
	Proces,
	ProcessSectionProps,
	ServicesProps,
	TargetAudienceSectionProps,
	WhyMeProps,
} from "./dataTypes";

export const proces: Proces[] = [
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
export const faqHome: FaqProps = {
	subheadline: "FAQ",
	questions: [
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
	],
};

export const aboutMeHome: AboutMeProps = {
	title: "Moje Doświadczenie w Tworzeniu Tatuaży",
	subheadline: "2 lata intensywnej nauki",
	image: images.zblizenie_na_twarz_patrzy_na_wprost,
	description: [
		"Artystyczne wykształcenie to fundament, ale prawdziwa nauka zaczęła się w studio. Każdy dzień to nowe wyzwania – różne typy skóry, różne oczekiwania klientów, różne techniki",
		"Studio Lewus Ink pozwala mi oferować tatuaże na najwyższym poziomie. Sterylne środowisko, profesjonalny sprzęt, komfortowe warunki. Mogę skupić się na sztuce, bo wszystko inne jest dopięte",
		"Każdy tatuaż traktuję jak wyzwanie artystyczne. Nie ma rutyny – jest ciągłe doskonalenie techniki i poszukiwanie najlepszych rozwiązań.",
	],
};

export const servicesHome: ServicesProps = {
	servicesType: "featured" as "main" | "featured",
	title: "Co mogę ci zaoferować?",
	subheadline: "Nie powtarzam schematów",
	description:
		"Nie ma szablonów. Każdy projekt to unikalna realizacja dostosowana do Twoich potrzeb i mojej wizji artystycznej.",
};

export const targetAudienceHome: TargetAudienceSectionProps = {
	title: "Dla Kogo Są Moje Tatuaże",
	image: images.karty_tatuazy,
	targetAudienceDsc: [
		{
			title: "Osoby ceniące jakość nad ceną",
			description:
				"Jeśli szukasz najtańszego tatuażu w okolicy – nie jestem dla Ciebie. Jeśli szukasz kogoś, kto zrobi to dobrze i będziesz zadowolony za 5 lat – pogadajmy.",
		},
		{
			title: "Miłośnicy przemyślanego designu",
			description:
				"Fine line, minimalizm, geometria – specjalizuję się w stylach wymagających precyzji. Jeśli lubisz czyste linie i przemyślane proporcje – rozumiemy się.",
		},
		{
			title: "Klienci którzy wiedzą czego chcą",
			description:
				"Nie jestem terapeutą ani doradcą życiowym. Jestem artystką, która realizuje konkretne wizje. Jeśli masz pomysł i potrzebujesz precyzyjnej realizacji – jesteśmy na tak.",
		},
	],
};

export const whyMeHome: WhyMeProps = {
	title: "Co wyróżnia moje tatuaże?",
	cards: {
		left: {
			title: "Autorskie projekty bez kopii",
			description: `Każdy szkic rysuję od zera. Nie ma "weź z Instagrama", nie ma szablonów. Tylko przemyślane, autorskie kompozycje.`,
			icon: ICONS.tabletGraphic,
		},
		centerTop: {
			title: "Precyzja na poziomie obsesji",
			description: `Artystyczne wykształcenie plus codzienną praktyka. Każda linia musi być dokładnie tam, gdzie zaplanowałam. Nie ma "w przybliżeniu".`,
			icon: ICONS.diamond,
		},
		centerBottom: {
			title: "Studio Lewus Ink jako gwarancja",
			description: `Jeden z najlepszych adresów w regionie. Najwyższe standardy higieny, profesjonalny sprzęt.`,
			icon: ICONS.tattooMachine,
		},
		right: {
			title: "Artystyczny fundament",
			description: `Pasja do rysowania od dziecka dała mi oko do tego co współgra ze sobą wizualnie. Po prostu wiem co zrobić aby tatauż prezentował się dobrze na skórze`,
			icon: ICONS.paletteBrush,
		},
	},
};

export const procesHome: ProcessSectionProps = {
	title: "Tatuaże - Proces Tworzenia",
	subheadline: "Od pierwszego szkicu do gojenia",
	description:
		"Jestem z Tobą na każdym etapie współpracy. Tylko przejrzysty proces i regularne update'y.",
	proces: proces,
};

export const contactHome: ContactProps = {
	subheadline: "Napisz – pogadamy o szczegółach",
	title: "Gotowy na Rozmowę o Twoim Projekcie?",
	description:
		"Marzysz o unikalnym tatuażu? Jestem tutaj, żeby tchnąć życie w Twoje pomysły. Pierwsza rozmowa jest zawsze bezpłatna. Opowiesz mi o swojej wizji, ja pokażę swoje prace i ustalimy, czy to ma sens.",
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
