// src/app/api/contact/route.tsx
// --- WERSJA Z DODATKOWYM LOGOWANIEM ---

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
// Usunięto nieużywany import sharp
import { uploadToWordPress } from "@/lib/wordpressUpload";
import { convertFileToWebP } from "@/lib/fileUtils";

// Inicjalizacja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Schemat walidacji dla danych z FormData
const contactFormSchema = z.object({
	name_surname: z.string().min(1, "Imię i nazwisko są wymagane"),
	email: z.string().email("Nieprawidłowy adres email"),
	phone_number: z.string().optional(),
	project_description: z
		.string()
		.min(10, "Opis musi mieć co najmniej 10 znaków"),
	file_input: z.string().optional(), // To pole wydaje się nieużywane, ale zostawiamy
	recaptcha_token: z.string().min(1, "Token reCAPTCHA jest wymagany"),
});

// Funkcja weryfikacji reCAPTCHA v3
async function verifyRecaptcha(
	token: string,
): Promise<{ success: boolean; score?: number }> {
	console.log("Contact API: Rozpoczynam weryfikację reCAPTCHA..."); // Log
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;

	if (!secretKey) {
		console.error(
			"Contact API Error: RECAPTCHA_SECRET_KEY nie znaleziony w .env",
		);
		// Zwracamy błąd, ale logujemy go najpierw
		return { success: false };
	}

	try {
		const response = await fetch(
			"https://www.google.com/recaptcha/api/siteverify",
			{
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: `secret=${secretKey}&response=${token}`,
			},
		);

		if (!response.ok) {
			console.error(
				`Contact API Error: Błąd zapytania do Google reCAPTCHA. Status: ${response.status}`,
			);
			return { success: false };
		}

		const data = await response.json();
		console.log("Contact API: Odpowiedź z Google reCAPTCHA:", data); // Log

		// Zmieniamy próg na 0.5 zgodnie z dokumentacją Google
		const isValid = data.success && data.score >= 0.5;
		console.log(
			`Contact API: Wynik weryfikacji reCAPTCHA: ${isValid ? "OK" : "Nieudana"} (score: ${data.score})`,
		); // Log

		return { success: isValid, score: data.score };
	} catch (error) {
		console.error(
			"Contact API Error: Krytyczny błąd podczas weryfikacji reCAPTCHA:",
			error,
		);
		return { success: false };
	}
}

export async function POST(request: Request) {
	console.log("✅ Contact API: Otrzymano żądanie POST"); // Log

	try {
		const contentType = request.headers.get("content-type") || "";
		console.log(`Contact API: Content-Type: ${contentType}`); // Log

		let formDataValues: { [key: string]: any } = {};
		let files: File[] = [];

		// Obsługa FormData
		if (contentType.includes("multipart/form-data")) {
			console.log("Contact API: Przetwarzanie jako multipart/form-data..."); // Log
			const formDataObj = await request.formData();

			formDataValues = {
				name_surname: formDataObj.get("name_surname") as string,
				email: formDataObj.get("email") as string,
				phone_number: (formDataObj.get("phone_number") as string) || undefined,
				project_description: formDataObj.get("project_description") as string,
				file_input: (formDataObj.get("file_input") as string) || undefined, // Nadal nie wiem do czego to służy
				recaptcha_token: formDataObj.get("recaptcha_token") as string,
			};
			files = formDataObj.getAll("files") as File[];
			console.log(
				`Contact API: Odczytano dane formularza. Liczba plików: ${files.length}`,
			); // Log
		} else if (contentType.includes("application/json")) {
			console.log("Contact API: Przetwarzanie jako application/json..."); // Log
			// Ten blok prawdopodobnie nie jest używany, ale dodajemy logi
			try {
				formDataValues = await request.json();
				console.log("Contact API: Odczytano dane JSON."); // Log
			} catch (parseError) {
				console.error("Contact API Error: Błąd parsowania JSON:", parseError); // Log
				return NextResponse.json(
					{ error: "Nieprawidłowy format JSON" },
					{ status: 400 },
				);
			}
		} else {
			console.error(
				`Contact API Error: Nieobsługiwany Content-Type: ${contentType}`,
			); // Log
			return NextResponse.json(
				{
					error:
						"Content-Type musi być application/json lub multipart/form-data",
				},
				{ status: 400 },
			);
		}

		// Walidacja danych formularza
		console.log("Contact API: Walidacja danych Zod..."); // Log
		const validationResult = contactFormSchema.safeParse(formDataValues);

		if (!validationResult.success) {
			console.error(
				"Contact API Error: Błąd walidacji Zod:",
				validationResult.error.issues,
			); // Log
			return NextResponse.json(
				{
					error: "Dane formularza są nieprawidłowe",
					details: validationResult.error.issues,
				},
				{ status: 400 },
			);
		}
		console.log("Contact API: Walidacja Zod pomyślna."); // Log

		const {
			name_surname,
			email,
			phone_number,
			project_description,
			recaptcha_token,
		} = validationResult.data;

		// Weryfikacja reCAPTCHA v3
		const recaptchaResult = await verifyRecaptcha(recaptcha_token); // Logi są wewnątrz tej funkcji

		if (!recaptchaResult.success) {
			console.error("Contact API Error: Weryfikacja reCAPTCHA nieudana."); // Log
			return NextResponse.json(
				{
					error: "Weryfikacja reCAPTCHA nieudana",
					score: recaptchaResult.score,
				},
				{ status: 400 },
			);
		}

		// Przetwarzanie plików (jeśli są) - używamy Promise.all
		const fileInfo: string[] = [];
		const fileUrls: string[] = [];

		if (files.length > 0) {
			console.log(
				`Contact API: Rozpoczynam przetwarzanie ${files.length} plików równolegle...`,
			); // Log

			const fileProcessingPromises = files.map(async (file) => {
				const startTime = Date.now(); // Log: Mierzenie czasu
				try {
					console.log(
						`Contact API:   [Plik: ${file.name}] Rozpoczynam konwersję...`,
					); // Log
					const { buffer, filename } = await convertFileToWebP(file, email);
					console.log(
						`Contact API:   [Plik: ${filename}] Konwersja zakończona (${Date.now() - startTime}ms). Rozpoczynam upload...`,
					); // Log

					const uploadResult = await uploadToWordPress(
						buffer,
						filename,
						"image/webp",
					);

					if (uploadResult.success && uploadResult.url) {
						console.log(
							`Contact API:   [Plik: ${filename}] Upload pomyślny (${Date.now() - startTime}ms). URL: ${uploadResult.url}`,
						); // Log
						return {
							status: "success" as const,
							url: uploadResult.url,
							info: `${filename} - ✅ Przesłany`,
						};
					} else {
						console.error(
							`Contact API Error: [Plik: ${filename}] Błąd uploadu: ${uploadResult.error} (${Date.now() - startTime}ms)`,
						); // Log
						return {
							status: "error" as const,
							info: `${filename} - ❌ Błąd uploadu: ${uploadResult.error}`,
						};
					}
				} catch (error) {
					console.error(
						`Contact API Error: [Plik: ${file.name}] Błąd konwersji: ${error instanceof Error ? error.message : error} (${Date.now() - startTime}ms)`,
					); // Log
					return {
						status: "error" as const,
						info: `${file.name} - ❌ Błąd konwersji`,
					};
				}
			});

			const results = await Promise.all(fileProcessingPromises);

			for (const result of results) {
				if (result.status === "success" && result.url) {
					fileUrls.push(result.url);
				}
				fileInfo.push(result.info);
			}

			console.log("Contact API: Zakończono przetwarzanie wszystkich plików."); // Log
		} else {
			console.log("Contact API: Brak plików do przetworzenia."); // Log
		}

		// Przygotowanie treści emaila (bez zmian w logice)
		console.log("Contact API: Tworzenie treści HTML emaila..."); // Log
		const emailHTML = `...`; // Tutaj wklej swój niezmieniony HTML emaila

		// Wysłanie emaila przez Resend
		console.log("Contact API: Rozpoczynam wysyłanie emaila przez Resend..."); // Log
		let emailSendResultData: { id: string } | null = null; // Zmienna do przechowania ID
		let emailSendError: any = null;

		try {
			const emailResult = await resend.emails.send({
				from: `Formularz Kontaktowy <${process.env.EMAIL_FROM}>`,
				to: [process.env.EMAIL_TO!], // Upewnij się, że EMAIL_TO jest poprawny
				replyTo: email,
				subject: `[Nowy Projekt] ${name_surname}${
					fileInfo.length > 0 ? ` (${fileInfo.length} plików)` : ""
				}`,
				html: emailHTML,
			});

			// Sprawdzamy odpowiedź Resend DOKŁADNIE
			if (emailResult.error) {
				emailSendError = emailResult.error;
			} else if (emailResult.data?.id) {
				emailSendResultData = emailResult.data;
				console.log(
					`Contact API: Resend zwrócił sukces. Email ID: ${emailResult.data.id}`,
				); // Log
			} else {
				// Dziwna sytuacja - brak błędu, ale i brak ID
				console.warn(
					"Contact API Warning: Resend nie zwrócił błędu, ale brakuje ID emaila w odpowiedzi:",
					emailResult,
				);
				emailSendError = new Error(
					"Nieznany błąd Resend - brak ID w odpowiedzi.",
				);
			}
		} catch (resendNetworkError) {
			// Błąd sieciowy podczas komunikacji z Resend
			console.error(
				"Contact API Error: Błąd sieciowy podczas wysyłania przez Resend:",
				resendNetworkError,
			); // Log
			emailSendError = resendNetworkError;
		}

		// Obsługa błędu Resend POZA blokiem try...catch dla samego wysłania
		if (emailSendError) {
			console.error(
				"Contact API Error: Nie udało się wysłać emaila przez Resend:",
				emailSendError,
			); // Log
			// Zwracamy błąd 500, ale nie przerywamy działania funkcji od razu
			return NextResponse.json(
				{ error: "Nie udało się wysłać emaila" },
				{ status: 500 },
			);
		}

		// Jeśli doszliśmy tutaj, email został wysłany
		console.log(
			"✅ Contact API: Email wysłany pomyślnie. Zwracam odpowiedź sukcesu.",
		); // Log
		return NextResponse.json(
			{
				message: "Wiadomość została wysłana pomyślnie",
				emailId: emailSendResultData?.id, // Używamy zapisanego ID
				recaptchaScore: recaptchaResult.score,
				filesProcessed: fileInfo.length, // Zwraca 0 jeśli nie było plików
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"❌ Contact API Error: Niespodziewany błąd w głównym bloku try...catch:",
			error,
		); // Log
		return NextResponse.json(
			{ error: "Wystąpił nieoczekiwany błąd serwera. Spróbuj ponownie." },
			{ status: 500 },
		);
	}
}

// Opcjonalnie: Dodaj endpoint HEAD dla /api/health (jeśli używasz checkApiHealth)
// export async function HEAD(request: Request) {
//   return new Response(null, { status: 200 });
// }
