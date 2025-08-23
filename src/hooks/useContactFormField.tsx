import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import {
	contactFormSchema,
	defaultFormValues,
	type ContactFormData,
} from "@/lib/schemas/contact-form-schema";
import {
	submitContactForm,
	prepareSubmissionData,
	formatApiError,
	getSuccessMessage,
	getProcessingMessage,
	type ContactApiError,
} from "@/lib/services/contact-api";
import { formatPhoneNumber } from "@/lib/utils";
import { FormVariant, getFormConfig } from "@/lib/config/form-config";

// ===========================================
// HOOK TYPES
// ===========================================

export interface UseContactFormOptions {
	variant?: FormVariant;
	onSuccess?: (data: ContactFormData) => void;
	onError?: (error: ContactApiError) => void;
}

export interface UseContactFormReturn {
	// Form state
	form: ReturnType<typeof useForm<ContactFormData>>;
	isSubmitting: boolean;

	// File handling - FIXED: Nie może być null
	files: File[];
	setFiles: (files: File[]) => void;
	removeFile: (index: number) => void;

	// Form actions
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
	resetForm: () => void;

	// Utilities
	formatPhone: (value: string) => string;
	config: ReturnType<typeof getFormConfig>;
}
// ===========================================
// MAIN HOOK
// ===========================================

/**
 * Hook do zarządzania formularzem kontaktowym
 * Zawiera całą business logic, validation i API calls
 */
export function useContactForm(
	options: UseContactFormOptions = {},
): UseContactFormReturn {
	const { variant = "main", onSuccess, onError } = options;

	// ===========================================
	// STATE MANAGEMENT
	// ===========================================

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	// Form configuration based on variant
	const config = getFormConfig(variant);

	// ReCAPTCHA hook
	const { executeRecaptcha } = useRecaptcha();

	// ===========================================
	// FORM SETUP
	// ===========================================

	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: defaultFormValues,
		mode: "onChange", // Validate on change for better UX
	});

	// ===========================================
	// FILE HANDLING
	// ===========================================

	/**
	 * Usuwa plik z listy uploadowanych plików
	 */
	const removeFile = useCallback(
		(indexToRemove: number) => {
			if (!files || files.length === 0) return;

			const updatedFiles = files.filter((_, index) => index !== indexToRemove);

			// ✅ FIXED: Ustaw na pustą tablicę zamiast null jeśli nie ma plików
			setFiles(updatedFiles.length > 0 ? updatedFiles : []);

			toast.info("Plik został usunięty", {
				duration: 2000,
			});
		},
		[files],
	);

	// ===========================================
	// FORM UTILITIES
	// ===========================================

	/**
	 * Formatuje numer telefonu z odpowiednimi spacjami
	 */
	const formatPhone = useCallback((value: string): string => {
		return formatPhoneNumber(value);
	}, []);

	/**
	 * Resetuje formularz i wszystkie stany
	 */
	const resetForm = useCallback(() => {
		form.reset(defaultFormValues);
		setFiles([]); // ✅ FIXED: Pusta tablica zamiast null
		setIsSubmitting(false);
	}, [form]);

	// ===========================================
	// FORM SUBMISSION
	// ===========================================

	/**
	 * Główna funkcja wysyłania formularza
	 */
	const handleSubmit = useCallback(
		async (data: ContactFormData) => {
			setIsSubmitting(true);

			try {
				// 1. Sprawdź limity plików dla danego wariantu
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

				// 4. Wykonaj reCAPTCHA
				const recaptchaToken = await executeRecaptcha("contact_form");

				// 5. Przygotuj dane do wysłania
				const submissionData = prepareSubmissionData(
					data,
					recaptchaToken,
					files || undefined,
				);

				// 6. Wyślij formularz
				const result = await submitContactForm(submissionData);

				// 7. Pokaż sukces
				const successMsg = getSuccessMessage(result.filesProcessed);
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

				// Formatuj błąd do user-friendly message
				const errorMessage =
					error instanceof Error
						? formatApiError(error)
						: "Wystąpił nieoczekiwany błąd";

				// Pokaż toast błędu
				toast.error("Błąd wysyłania 😞", {
					description: errorMessage,
					duration: 5000,
				});

				// Wywołaj callback błędu
				if (error instanceof Error) {
					onError?.(error as ContactApiError);
				}
			} finally {
				setIsSubmitting(false);
			}
		},
		[files, config, executeRecaptcha, resetForm, onSuccess, onError],
	);

	// ===========================================
	// RETURN HOOK INTERFACE
	// ===========================================

	return {
		// Form state
		form,
		isSubmitting,

		// File handling
		files,
		setFiles,
		removeFile,

		// Form actions
		onSubmit: form.handleSubmit(handleSubmit), // Fixed: use handleSubmit here
		resetForm,

		// Utilities
		formatPhone,
		config,
	};
}

// ===========================================
// SPECIALIZED HOOKS
// ===========================================

/**
 * Hook dla głównego formularza kontaktowego
 */
export function useMainContactForm(
	options?: Omit<UseContactFormOptions, "variant">,
) {
	return useContactForm({ ...options, variant: "main" });
}

/**
 * Hook dla formularza popup
 */
export function usePopupContactForm(
	options?: Omit<UseContactFormOptions, "variant">,
) {
	return useContactForm({ ...options, variant: "popup" });
}

// ===========================================
// VALIDATION HELPERS
// ===========================================

/**
 * Hook do sprawdzania czy formularz jest prawidłowy w czasie rzeczywistym
 */
export function useFormValidation() {
	const validateField = useCallback(
		(fieldName: keyof ContactFormData, value: string) => {
			try {
				const fieldSchema = contactFormSchema.shape[fieldName];
				fieldSchema.parse(value);
				return { isValid: true, error: null };
			} catch (error) {
				if (error instanceof Error) {
					return { isValid: false, error: error.message };
				}
				return { isValid: false, error: "Nieprawidłowa wartość" };
			}
		},
		[],
	);

	return { validateField };
}
