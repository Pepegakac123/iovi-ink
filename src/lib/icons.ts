const BASE_URL = "https://cms.iovi-ink.pl/wp-content/uploads/2025/08";

// ===========================================
// GŁÓWNE IKONY SYSTEMOWE
// ===========================================

export const SYSTEM_ICONS = {
	// Najczęściej używane
	instagram: `${BASE_URL}/instagram_ikona.svg`,
	tabletGraphic: `${BASE_URL}/Tablet-Graficzny.svg`,
	careForDetails: `${BASE_URL}/dbalosc_o-Detale_ikonka.svg`,

	// Ikony kontaktu
	envelope: `${BASE_URL}/envelope_icon_accent.svg`,
	instagramAccent: `${BASE_URL}/instagram_icon_accent.svg`,
	tattooMachine: `${BASE_URL}/tattoo_machine.svg`,
	tattooMachineAccent: `${BASE_URL}/tatto_machine_accent.svg`,
	locationAccent: `${BASE_URL}/location_accent.svg`,
} as const;

// ===========================================
// IKONY PROCESÓW (używane w Assets/index.js)
// ===========================================

export const PROCESS_ICONS = {
	chat: `${BASE_URL}/Czat-1.svg`,
	tabletGraphic: `${BASE_URL}/Tablet-Graficzny.svg`,
	diamond: `${BASE_URL}/diamond.svg`,
	careForDetails: `${BASE_URL}/dbalosc_o-Detale_ikonka.svg`,
	bandage: `${BASE_URL}/bandage_icon.svg`,
} as const;

// ===========================================
// IKONY FEATURE CARD (Hero section)
// ===========================================

export const FEATURE_ICONS = {
	paletteBrush: `${BASE_URL}/pallete_brusj.svg`,
	tabletGraphic: `${BASE_URL}/tablet_graficzny.svg`,
	biceps: `${BASE_URL}/Biceps_icon.svg`,
} as const;

// ===========================================
// WSZYSTKIE IKONY W JEDNYM OBIEKCIE
// ===========================================

export const ICONS = {
	// Instagram - używane w 6+ miejscach
	instagram: SYSTEM_ICONS.instagram,
	instagramAccent: SYSTEM_ICONS.instagramAccent,

	// Tablet/Design - używane w 3+ miejscach
	tabletGraphic: SYSTEM_ICONS.tabletGraphic,
	paletteBrush: FEATURE_ICONS.paletteBrush,
	biceps: FEATURE_ICONS.biceps,

	// Kontakt
	envelope: SYSTEM_ICONS.envelope,
	tattooMachine: SYSTEM_ICONS.tattooMachine,
	tattooMachineAccent: SYSTEM_ICONS.tattooMachineAccent,
	locationAccent: SYSTEM_ICONS.locationAccent,

	// Proces
	chat: PROCESS_ICONS.chat,
	diamond: PROCESS_ICONS.diamond,
	bandage: PROCESS_ICONS.bandage,

	// Detale
	careForDetails: SYSTEM_ICONS.careForDetails,
} as const;

// ===========================================
// HELPER TYPES DLA TYPESCRIPT
// ===========================================

export type IconName = keyof typeof ICONS;
export type SystemIconName = keyof typeof SYSTEM_ICONS;
export type ProcessIconName = keyof typeof PROCESS_ICONS;
export type FeatureIconName = keyof typeof FEATURE_ICONS;

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Pobiera URL ikony po nazwie z walidacją
 */
export const getIcon = (name: IconName): string => {
	const iconUrl = ICONS[name];
	if (!iconUrl) {
		console.warn(`Icon "${name}" not found in ICONS object`);
		return "";
	}
	return iconUrl;
};

/**
 * Sprawdza czy ikona istnieje
 */
export const hasIcon = (name: string): name is IconName => {
	return name in ICONS;
};

/**
 * Wszystkie dostępne nazwy ikon
 */
export const getAvailableIcons = (): IconName[] => {
	return Object.keys(ICONS) as IconName[];
};

// ===========================================
// DEPRECATED - do usunięcia po migracji
// ===========================================

/**
 * @deprecated Użyj ICONS.instagram zamiast tego
 */
export const INSTAGRAM_ICON = ICONS.instagram;

/**
 * @deprecated Użyj ICONS.tabletGraphic zamiast tego
 */
export const TABLET_ICON = ICONS.tabletGraphic;
