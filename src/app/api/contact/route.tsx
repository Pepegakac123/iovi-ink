import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import sharp from "sharp";
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
	file_input: z.string().optional(),
	recaptcha_token: z.string().min(1, "Token reCAPTCHA jest wymagany"),
});

// Funkcja weryfikacji reCAPTCHA v3 (bez zmian)
async function verifyRecaptcha(
	token: string,
): Promise<{ success: boolean; score?: number }> {
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;

	if (!secretKey) {
		console.error("RECAPTCHA_SECRET_KEY not found");
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

		const data = await response.json();
		const isValid = data.success && data.score >= 0.5;

		return { success: isValid, score: data.score };
	} catch (error) {
		console.error("reCAPTCHA verification error:", error);
		return { success: false };
	}
}

// Konwersja plików na WebP

export async function POST(request: Request) {
	try {
		const contentType = request.headers.get("content-type") || "";

		let formData: { [key: string]: any } = {};
		let files: File[] = [];

		// Obsługa FormData (z plikami) lub JSON (bez plików)
		if (contentType.includes("multipart/form-data")) {
			// FormData - z plikami
			const formDataObj = await request.formData();

			// Wyciągnij pola formularza
			formData = {
				name_surname: formDataObj.get("name_surname") as string,
				email: formDataObj.get("email") as string,
				phone_number: (formDataObj.get("phone_number") as string) || undefined,
				project_description: formDataObj.get("project_description") as string,
				file_input: (formDataObj.get("file_input") as string) || undefined,
				recaptcha_token: formDataObj.get("recaptcha_token") as string,
			};

			// Wyciągnij pliki
			files = formDataObj.getAll("files") as File[];
		} else if (contentType.includes("application/json")) {
			// JSON - bez plików (stary sposób)
			try {
				formData = await request.json();
			} catch (parseError) {
				return NextResponse.json(
					{ error: "Nieprawidłowy format JSON" },
					{ status: 400 },
				);
			}
		} else {
			return NextResponse.json(
				{
					error:
						"Content-Type musi być application/json lub multipart/form-data",
				},
				{ status: 400 },
			);
		}

		// Walidacja danych formularza
		const validationResult = contactFormSchema.safeParse(formData);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Dane formularza są nieprawidłowe",
					details: validationResult.error.issues,
				},
				{ status: 400 },
			);
		}

		const {
			name_surname,
			email,
			phone_number,
			project_description,
			recaptcha_token,
		} = validationResult.data;

		// Weryfikacja reCAPTCHA v3
		const recaptchaResult = await verifyRecaptcha(recaptcha_token);

		if (!recaptchaResult.success) {
			return NextResponse.json(
				{
					error: "Weryfikacja reCAPTCHA nieudana",
					score: recaptchaResult.score,
				},
				{ status: 400 },
			);
		}

		// Przetwarzanie plików (jeśli są)
		const fileInfo: string[] = [];
		const fileUrls: string[] = [];

		if (files.length > 0) {
			for (const file of files) {
				try {
					const { buffer, filename } = await convertFileToWebP(file, email);

					// ✅ NOWE: Upload do WordPress
					const uploadResult = await uploadToWordPress(
						buffer,
						filename,
						"image/webp",
					);

					if (uploadResult.success && uploadResult.url) {
						fileUrls.push(uploadResult.url);
						fileInfo.push(`${filename} - ✅ Przesłany`);
					} else {
						fileInfo.push(
							`${filename} - ❌ Błąd uploadu: ${uploadResult.error}`,
						);
						console.error(`❌ WordPress upload failed: ${uploadResult.error}`);
					}
				} catch (error) {
					console.error(`Błąd przetwarzania pliku ${file.name}:`, error);
					fileInfo.push(`${file.name} - ❌ Błąd konwersji`);
				}
			}
		}

		// Przygotowanie treści emaila
		const emailHTML = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
				<h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
					Nowa wiadomość z formularza kontaktowego
				</h2>
				
				<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<p><strong>👤 Imię i nazwisko:</strong> ${name_surname}</p>
					<p><strong>📧 Email:</strong> ${email}</p>
					${phone_number ? `<p><strong>📱 Telefon:</strong> ${phone_number}</p>` : ""}
					<p><strong>🤖 reCAPTCHA Score:</strong> ${recaptchaResult.score}</p>
				</div>
				
				<div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
					<h3 style="color: #333; margin-top: 0;">📝 Opis projektu:</h3>
					<p style="line-height: 1.6; white-space: pre-wrap;">${project_description}</p>
				</div>
				
				${
					fileUrls.length > 0
						? `
  <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">📎 Załączone pliki (${fileUrls.length}):</h3>
    ${fileUrls
			.map((url, index) => {
				const filename = url.split("/").pop() || `plik-${index + 1}`;
				return `
        <div style="margin: 10px 0; padding: 10px; background: #fff; border-radius: 5px; border-left: 3px solid #007cba;">
          <p style="margin: 0; font-weight: bold;">🖼️ ${filename}</p>
          <p style="margin: 5px 0 0 0;">
            <a href="${url}" target="_blank" style="color: #007cba; text-decoration: none; font-size: 14px;">
              📥 Pobierz plik → ${url}
            </a>
          </p>
        </div>
      `;
			})
			.join("")}
    <p style="font-size: 12px; color: #666; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
      ℹ️ Pliki zostały automatycznie skonwertowane na format WebP i przesłane do CMS.
    </p>
  </div>
`
						: ""
				}
				
				<div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
					<p style="margin: 0; font-size: 12px; color: #666;">
						📅 Wysłane: ${new Date().toLocaleString("pl-PL")} <br>
						💻 Adres IP: ${request.headers.get("x-forwarded-for") || "nieznany"}
					</p>
				</div>
			</div>
		`;

		// Wysłanie emaila przez Resend
		const emailResult = await resend.emails.send({
			from: "Formularz Kontaktowy <onboarding@resend.dev>",
			to: [process.env.EMAIL_TO!],
			replyTo: email,
			subject: `[Nowy Projekt] ${name_surname}${fileInfo.length > 0 ? ` (${fileInfo.length} plików)` : ""}`,
			html: emailHTML,
		});

		if (emailResult.error) {
			console.error("Resend error:", emailResult.error);
			return NextResponse.json(
				{ error: "Nie udało się wysłać emaila" },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				message: "Wiadomość została wysłana pomyślnie",
				emailId: emailResult.data?.id,
				recaptchaScore: recaptchaResult.score,
				filesProcessed: fileInfo.length,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Wystąpił błąd serwera. Spróbuj ponownie." },
			{ status: 500 },
		);
	}
}
