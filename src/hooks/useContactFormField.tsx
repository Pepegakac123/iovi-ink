// hooks/useContactFormField.tsx (POPRAWIONY)
"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import {
	ContactFormData,
	contactFormSchema,
	defaultFormValues,
} from "@/lib/schemas/contact-form-schema";
import {
	submitContactForm,
	ContactSubmissionData,
} from "@/lib/services/contact-api";
import { getFormConfig, FormVariant } from "@/lib/config/form-config";
import { formatPhoneNumber } from "@/lib/utils";

// ===========================================
// HOOK CONFIGURATION TYPES
// ===========================================

interface ContactFormOptions {
	onSuccess?: (data: ContactFormData) => void;
	onError?: (error: Error) => void;
	variant?: FormVariant; // ✅ DODANE: Obsługa wariantów
}

interface ContactFormReturn {
	form: ReturnType<typeof useForm<ContactFormData>>;
	files: File[] | null;
	setFiles: (files: File[] | null) => void;
	isSubmitting: boolean;
	handleSubmit: (data: ContactFormData) => Promise<void>;
	removeFile: (index: number) => void;
	formatPhone: (value: string) => string;
	resetForm: () => void;
}

// ===========================================
// POPRAWIONY CONTACT FORM HOOK
// ===========================================

/**
 * Hook obsługujący formularze kontaktowe z accessibility support
 */
export const useContactFormField = ({
	onSuccess,
	onError,
	variant = "main", // ✅ DODANE: Default variant
}: ContactFormOptions): ContactFormReturn => {
	// ✅ Konfiguracja dla wariantu
	const config = getFormConfig(variant);

	// ✅ Form setup z react-hook-form (ZACHOWANE)
	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: defaultFormValues,
		mode: "onChange",
	});

	// ✅ State management (ZACHOWANE)
	const [files, setFiles] = useState<File[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// ✅ reCAPTCHA hook (ZACHOWANE)
	const { executeRecaptcha } = useRecaptcha();

	// ===========================================
	// UTILITY FUNCTIONS (ZACHOWANE I POPRAWIONE)
	// ===========================================

	/**
	 * Formatuje numer telefonu z odpowiednimi spacjami
	 */
	const formatPhone = useCallback((value: string): string => {
		return formatPhoneNumber(value);
	}, []);

	/**
	 * Usuwa plik z listy z toast notification
	 */
	const removeFile = useCallback(
		(index: number) => {
			if (!files) return;

			const updatedFiles = files.filter((_, i) => i !== index);
			setFiles(updatedFiles.length > 0 ? updatedFiles : null);

			toast.info("Plik został usunięty", {
				duration: 2000,
			});
		},
		[files],
	);

	/**
	 * Resetuje formularz i wszystkie stany
	 */
	const resetForm = useCallback(() => {
		form.reset(defaultFormValues);
		setFiles(null);
		setIsSubmitting(false);
	}, [form]);

	// ===========================================
	// MESSAGE HELPERS (POPRAWIONE)
	// ===========================================

	const getProcessingMessage = useCallback((fileCount: number) => {
		if (fileCount === 1) {
			return {
				title: "Przetwarzam plik...",
				description: "Zmniejszam rozmiar Twojego zdjęcia, aby wysłać je szybciej.",
			};
		}
		return {
			title: `Przetwarzam ${fileCount} plików...`,
			description: "Optymalizuję Twoje zdjęcia dla szybszego przesyłania.",
		};
	}, []);

	const getSuccessMessage = useCallback((filesProcessed: number) => {
		const baseMessage = "Wiadomość została wysłana! 🎉";

		if (filesProcessed === 0) {
			return {
				title: baseMessage,
				description: "Odpiszę najszybciej jak to możliwe.",
			};
		}

		if (filesProcessed === 1) {
			return {
				title: baseMessage,
				description: "Zdjęcie zostało zoptymalizowane i wysłane.",
			};
		}

		return {
			title: baseMessage,
			description: `${filesProcessed} plików zostało pomyślnie wysłanych.`,
		};
	}, []);

	const formatApiError = useCallback(
		(error: Error): string => {
			if (error.message.includes("reCAPTCHA")) {
				return "Błąd weryfikacji bezpieczeństwa. Odśwież stronę i spróbuj ponownie.";
			}

			if (error.message.includes("rozmiar")) {
				const maxSizeMB = config.files.maxSize / (1024 * 1024);
				return `Niektóre pliki są za duże. Maksymalny rozmiar to ${maxSizeMB}MB.`;
			}

			if (error.message.includes("format")) {
				return "Nieobsługiwany format pliku. Użyj JPG, PNG, WebP lub PDF.";
			}

			if (error.message.includes("sieć") || error.message.includes("network")) {
				return "Problem z połączeniem internetowym. Sprawdź połączenie i spróbuj ponownie.";
			}

			return "Wystąpił błąd podczas wysyłania. Spróbuj ponownie za chwilę.";
		},
		[config.files.maxSize],
	);

	const prepareSubmissionData = useCallback(
		(
			data: ContactFormData,
			recaptchaToken: string,
			files?: File[],
		): ContactSubmissionData => {
			return {
				...data,
				recaptcha_token: recaptchaToken,
				files: files || undefined,
			};
		},
		[],
	);

	// ===========================================
	// MAIN FORM SUBMISSION (POPRAWIONE)
	// ===========================================

	/**
	 * Główna funkcja wysyłania formularza z obsługą wariantów
	 */
	const handleSubmit = useCallback(
		async (data: ContactFormData) => {
			setIsSubmitting(true);

			try {
				// 1. ✅ POPRAWIONE: Sprawdź limity dla konkretnego wariantu
				if (files && files.length > config.files.maxFiles) {
					throw new Error(`Maksymalnie ${config.files.maxFiles} plików`);
				}

				// 2. Sprawdź rozmiary plików
				if (files) {
					const oversizedFiles = files.filter(
						(file) => file.size > config.files.maxSize,
					);
					if (oversizedFiles.length > 0) {
						const maxSizeMB = config.files.maxSize / (1024 * 1024);
						throw new Error(`Niektóre pliki przekraczają limit ${maxSizeMB}MB`);
					}
				}

				// 3. Pokaż toast o przetwarzaniu (jeśli są pliki)
				if (files && files.length > 0) {
					const processingMsg = getProcessingMessage(files.length);
					toast.info(processingMsg.title, {
						description: processingMsg.description,
						duration: 3000,
					});
				}

				// 4. ✅ POPRAWIONE: Wykonaj reCAPTCHA z custom hook
				// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
				let recaptchaToken;
				try {
					recaptchaToken = await executeRecaptcha("contact_form");
				} catch (recaptchaError) {
					console.error("reCAPTCHA error:", recaptchaError);
					throw new Error(
						"Błąd weryfikacji reCAPTCHA. Odśwież stronę i spróbuj ponownie.",
					);
				}

				// 5. Przygotuj dane do wysłania
				const submissionData = prepareSubmissionData(
					data,
					recaptchaToken,
					files || undefined,
				);

				// 6. Wyślij formularz
				const result = await submitContactForm(submissionData);

				// 7. Pokaż sukces
				const successMsg = getSuccessMessage(result.filesProcessed || 0);
				toast.success(successMsg.title, {
					description: successMsg.description,
					duration: 5000,
				});

				// 8. Reset formularza
				resetForm();

				// 9. Wywołaj callback sukcesu
				onSuccess?.(data);
			} catch (error) {
				console.error("Form submission error:", error);

				const errorMessage =
					error instanceof Error
						? formatApiError(error)
						: "Wystąpił nieoczekiwany błąd";

				// ✅ POPRAWIONE: Różne komunikaty dla różnych wariantów
				const errorTitle =
					variant === "popup" ? "Błąd wysyłania" : "Błąd wysyłania 😞";

				toast.error(errorTitle, {
					description: errorMessage,
					duration: 5000,
				});

				if (error instanceof Error) {
					onError?.(error);
				}
			} finally {
				setIsSubmitting(false);
			}
		},
		[
			files,
			config,
			variant,
			executeRecaptcha,
			getProcessingMessage,
			getSuccessMessage,
			prepareSubmissionData,
			formatApiError,
			resetForm,
			onSuccess,
			onError,
		],
	);

	return {
		form,
		files,
		setFiles,
		isSubmitting,
		handleSubmit,
		removeFile,
		formatPhone,
		resetForm,
	};
};

// ===========================================
// CONVENIENCE FUNCTIONS (DODANE)
// ===========================================

/**
 * Hook dla głównego formularza kontaktowego
 */
export const useMainContactForm = (
	options: Omit<ContactFormOptions, "variant">,
) => {
	return useContactFormField({ ...options, variant: "main" });
};

/**
 * Hook dla popup formularza kontaktowego
 */
export const usePopupContactForm = (
	options: Omit<ContactFormOptions, "variant">,
) => {
	return useContactFormField({ ...options, variant: "popup" });
};
