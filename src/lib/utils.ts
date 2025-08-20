import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (value: string) => {
	// Usuń wszystko co nie jest cyfrą
	const numbers = value.replace(/\D/g, "");

	// Ogranicz do 9 cyfr
	const limited = numbers.slice(0, 9);

	// Formatuj z spacjami: XXX XXX XXX
	if (limited.length >= 7) {
		return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
	} else if (limited.length >= 4) {
		return `${limited.slice(0, 3)} ${limited.slice(3)}`;
	} else {
		return limited;
	}
};
