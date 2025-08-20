"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import { LuHardDriveUpload } from "react-icons/lu";
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/file-upload";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { DropzoneOptions } from "react-dropzone";
import InstagramBtn from "../buttons/InstragramBtn";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import { formatPhoneNumber } from "@/lib/utils";

// Funkcja formatująca numer telefonu z spacjami

const formSchema = z.object({
	name_surname: z.string().min(1, "Imię i nazwisko są wymagane"),
	email: z.string().email("Nieprawidłowy adres email"),
	phone_number: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val) return true; // Pole opcjonalne
				// Usuń spacje i sprawdź czy ma dokładnie 9 cyfr
				const numbersOnly = val.replace(/\s/g, "");
				return /^\d{9}$/.test(numbersOnly);
			},
			{
				message: "Numer telefonu musi mieć dokładnie 9 cyfr",
			},
		),
	project_description: z
		.string()
		.min(10, "Opis musi mieć co najmniej 10 znaków"),
	file_input: z.string().optional(),
});

export default function ContactForm() {
	const [files, setFiles] = useState<File[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { executeRecaptcha } = useRecaptcha();

	const dropZoneConfig = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 10,
		multiple: true,
		accept: {
			"image/jpeg": [".jpg", ".jpeg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
			"image/tiff": [".tiff", ".tif"],
			"image/bmp": [".bmp"],
			"application/pdf": [".pdf"],
		},
	} satisfies DropzoneOptions;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name_surname: "",
			email: "",
			phone_number: "",
			project_description: "",
			file_input: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);

		try {
			// 1. Wykonaj reCAPTCHA v3 w tle
			const recaptchaToken = await executeRecaptcha("contact_form");

			// 2. Przygotuj FormData zamiast JSON
			const formData = new FormData();

			// Dodaj pola formularza - trimuj numer telefonu
			formData.append("name_surname", values.name_surname);
			formData.append("email", values.email);
			formData.append(
				"phone_number",
				values.phone_number ? values.phone_number.replace(/\s/g, "") : "",
			);
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
				toast.success("Sukces!", {
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

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	} as Variants;

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 15,
			},
		},
	} as Variants;

	const labelVariants = {
		rest: { y: 0, color: "hsl(var(--foreground))" },
		hover: {
			y: -2,
			color: "hsl(var(--primary))",
			transition: { type: "spring", stiffness: 400, damping: 30 },
		},
	} as Variants;

	const inputVariants = {
		rest: {
			scale: 1,
			borderColor: "hsl(var(--foreground))",
		},
		hover: {
			scale: 1.02,
			borderColor: "hsl(var(--primary))",
			transition: { type: "spring", stiffness: 400, damping: 30 },
		},
		focus: {
			scale: 1.02,
			borderColor: "hsl(var(--primary))",
			boxShadow: "0 0 0 2px hsl(var(--primary) / 0.2)",
			transition: { type: "spring", stiffness: 400, damping: 30 },
		},
	} as Variants;

	return (
		<div className="w-full max-w-3xl mx-auto">
			{/* Brutal Design Form Container */}
			<motion.div
				className="bg-background border-2 border-b-4 border-r-4 border-foreground rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_theme(colors.foreground)] transition-all duration-200 hover:shadow-[6px_6px_0px_0px_theme(colors.foreground)] relative overflow-hidden"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				whileHover={{ scale: 1.005 }}
			>
				<Form {...form}>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{/* Górny rząd: Imię, Email, Telefon */}
						<motion.div
							className="grid grid-cols-1 md:grid-cols-3 gap-4"
							variants={itemVariants}
						>
							<FormField
								control={form.control}
								name="name_surname"
								render={({ field }) => (
									<motion.div
										initial="rest"
										whileHover="hover"
										whileFocus="focus"
									>
										<FormItem>
											<motion.div variants={labelVariants}>
												<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block whitespace-nowrap">
													Imię i nazwisko*
												</FormLabel>
											</motion.div>
											<FormControl>
												<motion.div variants={inputVariants}>
													<Input
														placeholder="Anna Kowalska"
														className="bg-secondary/70 border-2 border-foreground font-text h-12 rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background transform translate-x-0 translate-y-0 hover:translate-x-0 hover:translate-y-0 focus:placeholder-transparent placeholder-transition"
														{...field}
													/>
												</motion.div>
											</FormControl>
											<FormMessage />
										</FormItem>
									</motion.div>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<motion.div
										initial="rest"
										whileHover="hover"
										whileFocus="focus"
									>
										<FormItem>
											<motion.div variants={labelVariants}>
												<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block whitespace-nowrap">
													E-mail*
												</FormLabel>
											</motion.div>
											<FormControl>
												<motion.div variants={inputVariants}>
													<Input
														placeholder="anna@wp.pl"
														type="email"
														className="bg-secondary/70 border-2 border-foreground font-text h-12 rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background transform translate-x-0 translate-y-0 hover:translate-x-0 hover:translate-y-0 focus:placeholder-transparent placeholder-transition"
														{...field}
													/>
												</motion.div>
											</FormControl>
											<FormMessage />
										</FormItem>
									</motion.div>
								)}
							/>

							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<motion.div
										initial="rest"
										whileHover="hover"
										whileFocus="focus"
									>
										<FormItem>
											<motion.div variants={labelVariants}>
												<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block whitespace-nowrap">
													Nr Telefonu
												</FormLabel>
												<span className="text-xs text-muted-foreground font-normal normal-case ml-1">
													(Opcjonalne)
												</span>
											</motion.div>
											<FormControl>
												<motion.div variants={inputVariants}>
													<Input
														placeholder="123 456 789"
														className="bg-secondary/70 border-2 border-foreground font-text h-12 rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background transform translate-x-0 translate-y-0 hover:translate-x-0 hover:translate-y-0 focus:placeholder-transparent placeholder-transition"
														value={field.value || ""}
														onChange={(e) => {
															const formatted = formatPhoneNumber(
																e.target.value,
															);
															field.onChange(formatted);
														}}
														onBlur={field.onBlur}
														name={field.name}
														ref={field.ref}
													/>
												</motion.div>
											</FormControl>
											<FormMessage />
										</FormItem>
									</motion.div>
								)}
							/>
						</motion.div>

						{/* Duże pole tekstowe */}
						<motion.div variants={itemVariants}>
							<FormField
								control={form.control}
								name="project_description"
								render={({ field }) => (
									<motion.div
										initial="rest"
										whileHover="hover"
										whileFocus="focus"
									>
										<FormItem>
											<motion.div variants={labelVariants}>
												<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block">
													Jak mogę ci pomóc
												</FormLabel>
											</motion.div>
											<FormControl>
												<motion.div variants={inputVariants}>
													<Textarea
														placeholder="Opisz swój projekt - styl, rozmiar, miejsce na ciele, inspiracje..."
														className="bg-secondary/70 border-2 border-foreground font-text min-h-28 resize-none rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background transform translate-x-0 translate-y-0 hover:translate-x-0 hover:translate-y-0 focus:placeholder-transparent placeholder-transition"
														{...field}
													/>
												</motion.div>
											</FormControl>
											<FormMessage />
										</FormItem>
									</motion.div>
								)}
							/>
						</motion.div>

						{/* File Upload - opcjonalne */}
						<motion.div variants={itemVariants}>
							<FormField
								control={form.control}
								name="file_input"
								render={({ field }) => (
									<FormItem>
										<motion.div
											initial="rest"
											whileHover="hover"
											variants={labelVariants}
										>
											<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block">
												Prześlij wzór lub inspirację
											</FormLabel>
											<span className="text-xs text-muted-foreground font-normal normal-case ml-1">
												(Opcjonalne)
											</span>
										</motion.div>
										<FormControl>
											<motion.div
												whileHover={{ scale: 1.01 }}
												transition={{ type: "spring", stiffness: 300 }}
											>
												<FileUploader
													value={files}
													onValueChange={setFiles}
													dropzoneOptions={dropZoneConfig}
													className="relative bg-secondary/30 rounded-md border-2 border-foreground p-2 transition-all duration-200 transform translate-x-0 translate-y-0 hover:translate-x-0 hover:translate-y-0"
												>
													{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
													<FileInput
														id="mainContactFileInput"
														className="border-2 border-dashed border-foreground/40 hover:border-primary/60 transition-colors duration-200 bg-background/30 rounded-md"
													>
														<div className="flex items-center justify-center flex-col p-6 w-full">
															<motion.div
																animate={{
																	y: [0, -8, 0],
																}}
																transition={{
																	duration: 2.5,
																	repeat: Infinity,
																	ease: "easeInOut",
																}}
																whileHover={{
																	y: -12,
																	rotate: [0, 5, -5, 0],
																	transition: { duration: 0.3 },
																}}
															>
																<LuHardDriveUpload className="text-primary w-8 h-8 mb-3" />
															</motion.div>
															<motion.p
																className="mb-1 text-sm text-foreground font-primary font-bold"
																initial={{ opacity: 0.8 }}
																whileHover={{ opacity: 1, scale: 1.05 }}
															>
																<span className="font-bold">
																	Naciśnij aby dodać
																</span>{" "}
																lub przeciągnij i upuść
															</motion.p>
															<p className="text-xs text-muted-foreground font-text">
																PNG, JPG, PDF. Maksymalny rozmiar 10 MB
															</p>
														</div>
													</FileInput>
													<FileUploaderContent>
														{files &&
															files.length > 0 &&
															files.map((file, i) => (
																<motion.div
																	key={file.name}
																	initial={{ opacity: 0, x: -20, scale: 0.8 }}
																	animate={{ opacity: 1, x: 0, scale: 1 }}
																	exit={{ opacity: 0, x: 20, scale: 0.8 }}
																	transition={{
																		delay: i * 0.1,
																		type: "spring",
																		stiffness: 200,
																	}}
																	whileHover={{
																		scale: 1.02,
																		y: -2,
																		transition: {
																			type: "spring",
																			stiffness: 400,
																		},
																	}}
																>
																	<FileUploaderItem
																		index={i}
																		className="bg-background border-2 border-foreground hover:bg-accent/20 transition-all duration-200 rounded-sm mt-2 transform translate-x-0 translate-y-0 hover:translate-x-0 hover:translate-y-0"
																	>
																		<motion.div
																			animate={{ rotate: [0, 5, -5, 0] }}
																			transition={{
																				duration: 2,
																				repeat: Infinity,
																				ease: "easeInOut",
																				delay: i * 0.3,
																			}}
																		>
																			<Paperclip className="h-4 w-4 stroke-current text-primary" />
																		</motion.div>
																		<span className="font-text text-foreground text-sm font-medium">
																			{file.name}
																		</span>
																	</FileUploaderItem>
																</motion.div>
															))}
													</FileUploaderContent>
												</FileUploader>
											</motion.div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</motion.div>

						{/* Submit Button Section */}
						<motion.div
							className="flex gap-4 flex-col w-full items-center justify-center pt-6"
							variants={itemVariants}
						>
							{/* Przycisk WYŚLIJ */}
							<motion.button
								type="submit"
								className="bg-primary cursor-pointer text-background font-primary text-base md:text-lg w-full px-4 md:px-8 py-4 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-3 group"
								whileHover={{
									scale: 1.05,
									backgroundColor: "var(--accent)",
									boxShadow: "4px 4px 0px 0px var(--foreground)",
									transition: { duration: 0.2 },
								}}
								whileTap={{
									scale: 0.98,
									transition: { duration: 0.1 },
								}}
							>
								{isSubmitting ? "WYSYŁANIE..." : "WYŚLIJ"}
							</motion.button>

							{/* Separator LUB */}
							<motion.span
								className="text-foreground uppercase text-lg md:text-xl font-primary font-bold"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
								whileHover={{
									scale: 1.1,
									color: "hsl(var(--primary))",
									transition: { type: "spring", stiffness: 400 },
								}}
							>
								LUB
							</motion.span>

							{/* Instagram Button */}
							<motion.div
								className="w-full"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
							>
								<InstagramBtn
									text="SKONTAKTUJ SIĘ PRZEZ INSTAGRAM"
									link="https://www.instagram.com/iovi.ink/"
								/>
							</motion.div>
						</motion.div>
					</motion.form>
				</Form>

				{/* Enhanced Decorative elements */}
				<motion.div
					className="absolute top-4 right-4 w-3 h-3 bg-accent border-2 border-foreground rounded-full"
					animate={{
						x: [0, 8, 0],
						y: [0, -8, 0],
						rotate: [0, 180, 360],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					whileHover={{ scale: 1.5 }}
				/>

				<motion.div
					className="absolute bottom-4 left-4 w-2 h-2 bg-primary border-2 border-foreground transform rotate-45"
					animate={{
						x: [0, -6, 0],
						y: [0, 6, 0],
						rotate: [45, 225, 405],
						scale: [1, 0.8, 1],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1.5,
					}}
					whileHover={{ scale: 1.3 }}
				/>

				{/* Additional floating elements */}
				<motion.div
					className="absolute top-1/2 right-2 w-1 h-1 bg-secondary border border-foreground rounded-full"
					animate={{
						y: [0, -20, 0],
						opacity: [0.3, 1, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
				/>

				<motion.div
					className="absolute bottom-1/3 left-2 w-1 h-1 bg-accent border border-foreground"
					animate={{
						x: [0, 15, 0],
						rotate: [0, 90, 180],
						opacity: [0.5, 1, 0.5],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 3,
					}}
				/>
			</motion.div>
		</div>
	);
}
