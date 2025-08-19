"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/file-upload";
import { useRecaptcha } from "@/hooks/useRecaptcha"; // ← DODANE
import SecondaryBtn from "../buttons/SecondaryBtn";

// ✅ SCHEMAT BEZ recaptcha field (v3 działa w tle)
const formSchema = z.object({
	name_surname: z.string().min(1, "Imię i nazwisko są wymagane"),
	email: z.string().email("Nieprawidłowy adres email"),
	phone_number: z.string().optional(),
	project_description: z
		.string()
		.min(10, "Opis musi mieć co najmniej 10 znaków"),
	file_input: z.string().optional(),
});

export default function MyForm() {
	const [files, setFiles] = useState<File[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false); // ← DODANE: loading state
	const { executeRecaptcha } = useRecaptcha(); // ← DODANE: reCAPTCHA hook

	const dropZoneConfig = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 4,
		multiple: true,
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			// ← DODANE: default values
			name_surname: "",
			email: "",
			phone_number: "",
			project_description: "",
			file_input: "",
		},
	});

	// ✅ NOWA FUNKCJA onSubmit z API integration
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);

		try {
			// 1. Wykonaj reCAPTCHA v3 w tle
			const recaptchaToken = await executeRecaptcha("contact_form");

			// 2. Przygotuj FormData zamiast JSON
			const formData = new FormData();

			// Dodaj pola formularza
			formData.append("name_surname", values.name_surname);
			formData.append("email", values.email);
			formData.append("phone_number", values.phone_number || "");
			formData.append("project_description", values.project_description);
			formData.append("file_input", values.file_input || "");
			formData.append("recaptcha_token", recaptchaToken);

			// Dodaj pliki (jeśli są)
			if (files && files.length > 0) {
				files.forEach((file) => {
					formData.append("files", file);
				});

				toast.info("Przetwarzanie plików...", {
					description: `Konwertowanie ${files.length} plików na WebP...`,
				});
			}

			// 3. Wyślij do API (ten sam endpoint!)
			const response = await fetch("/api/contact", {
				method: "POST",
				body: formData, // FormData zamiast JSON!
				// Usuń Content-Type header - przeglądarka ustawi automatycznie z boundary
			});

			const result = await response.json();

			if (response.ok) {
				toast.success("Sukces! 🎉", {
					description:
						result.filesProcessed > 0
							? `Wiadomość wysłana z ${result.filesProcessed} plikami!`
							: "Wiadomość została wysłana. Odezwę się wkrótce!",
				});

				form.reset();
				setFiles(null);
			} else {
				throw new Error(result.error || "Wystąpił błąd");
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("Błąd wysyłania 😞", {
				description:
					error instanceof Error
						? error.message
						: "Nie udało się wysłać wiadomości.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 max-w-3xl mx-auto py-10"
			>
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-12 md:col-span-4">
						<FormField
							control={form.control}
							name="name_surname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Imię i nazwisko</FormLabel>
									<FormControl>
										<Input placeholder="Anna Kowalska" type="" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-12 md:col-span-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input placeholder="anna@wp.pl" type="email" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-12 md:col-span-4">
						<FormField
							control={form.control}
							name="phone_number"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel>Nr Telefonu</FormLabel>
									<FormControl className="w-full">
										<PhoneInput
											placeholder="123 456 789"
											{...field}
											defaultCountry="PL"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<FormField
					control={form.control}
					name="project_description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Jak mogę ci pomóc</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Opisz swój projekt - styl, rozmiar, miejsce na ciele, inspiracje..."
									className="resize-none"
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="file_input"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prześlij wzór lub inspirację</FormLabel>
							<FormControl>
								<FileUploader
									value={files}
									onValueChange={setFiles}
									dropzoneOptions={dropZoneConfig}
									className="relative bg-background rounded-lg p-2"
								>
									<FileInput
										id={uuidv4()}
										className="outline-dashed outline-1 outline-slate-500"
									>
										<div className="flex items-center justify-center flex-col p-8 w-full ">
											<CloudUpload className="text-gray-500 w-10 h-10" />
											<p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
												<span className="font-semibold">
													Naciśnij aby dodać
												</span>
												&nbsp; lub przeciągnij i upuść
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												SVG, PNG, JPG lub PDF. Maksymalny rozmiar pliku 10 MB
											</p>
										</div>
									</FileInput>
									<FileUploaderContent>
										{files &&
											files.length > 0 &&
											files.map((file, i) => (
												<FileUploaderItem key={file.name} index={i}>
													<Paperclip className="h-4 w-4 stroke-current" />
													<span>{file.name}</span>
												</FileUploaderItem>
											))}
									</FileUploaderContent>
								</FileUploader>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				{/* ✅ ZMODYFIKOWANY BUTTON z loading state */}
				<div className="flex gap-8 flex-col md:flex-row w-full items-center justify-center">
					<Button
						type="submit"
						disabled={isSubmitting}
						className="bg-primary text-background font-primary text-base w-full md:w-fit px-4 md:px-8 py-3 md:py-4 uppercase border-1 border-foreground rounded-md cursor-pointer hover:bg-accent transition-colors duration-200"
					>
						{isSubmitting ? "Wysyłanie..." : "Wyślij Wiadomość"}
					</Button>
					<span className="text-foreground uppercase text-2xl font-primary">
						LUB
					</span>
					<SecondaryBtn
						text="Skontaktuj się przez instagrama"
						link="https://www.instagram.com/iovi.ink/"
					/>
				</div>
			</form>
		</Form>
	);
}
