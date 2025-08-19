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
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { DropzoneOptions } from "react-dropzone";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import InstagramBtn from "../buttons/InstragramBtn";

const formSchema = z.object({
	name_surname: z.string().min(1, "Imię i nazwisko są wymagane"),
	email: z.string().email("Nieprawidłowy adres email"),
	phone_number: z.string().optional(),
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

	// Motion variants matching the project style
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.2,
			},
		},
	} as Variants;

	const itemVariants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);

		try {
			const recaptchaToken = await executeRecaptcha("contact_form");

			const formData = new FormData();
			formData.append("name_surname", values.name_surname);
			formData.append("email", values.email);
			formData.append("phone_number", values.phone_number || "");
			formData.append("project_description", values.project_description);
			formData.append("file_input", values.file_input || "");
			formData.append("recaptcha_token", recaptchaToken);

			// Dodaj pliki jeśli są
			if (files && files.length > 0) {
				files.forEach((file) => {
					formData.append("files", file);
				});

				toast.info("Przetwarzanie plików...", {
					description: `Konwertowanie ${files.length} plików na WebP...`,
				});
			}

			const response = await fetch("/api/contact", {
				method: "POST",
				body: formData,
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
		<motion.div
			className="w-full"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={containerVariants}
		>
			{/* Form Container with Brutal Design styling */}
			<motion.div
				className="bg-background border-1 border-b-4 border-r-4 border-foreground rounded-md p-4 md:p-6 lg:p-8 relative overflow-hidden"
				variants={itemVariants}
				whileHover={{
					boxShadow: "6px 6px 0px 0px var(--foreground)",
					transition: { duration: 0.3 },
				}}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Form Fields Grid */}
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
							variants={containerVariants}
						>
							{/* Name Field */}
							<motion.div variants={itemVariants}>
								<FormField
									control={form.control}
									name="name_surname"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-foreground font-primary text-sm md:text-base">
												Imię i nazwisko
											</FormLabel>
											<FormControl>
												<Input placeholder="Anna Kowalska" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>

							{/* Email Field */}
							<motion.div variants={itemVariants}>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-foreground font-primary text-sm md:text-base">
												E-mail
											</FormLabel>
											<FormControl>
												<Input
													placeholder="anna@wp.pl"
													type="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						</motion.div>

						{/* Phone Field */}
						<motion.div variants={itemVariants}>
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem className="flex flex-col items-start">
										<FormLabel className="text-foreground font-primary text-sm md:text-base">
											Nr Telefonu (opcjonalnie)
										</FormLabel>
										<FormControl className="w-full">
											<PhoneInput
												placeholder="123 456 789"
												defaultCountry="PL"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</motion.div>

						{/* Project Description */}
						<motion.div variants={itemVariants}>
							<FormField
								control={form.control}
								name="project_description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-foreground font-primary text-sm md:text-base">
											Jak mogę ci pomóc
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Opisz swój projekt - styl, rozmiar, miejsce na ciele, inspiracje..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</motion.div>

						{/* File Upload */}
						<motion.div variants={itemVariants}>
							<FormField
								control={form.control}
								name="file_input"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-foreground font-primary text-sm md:text-base">
											Prześlij wzór lub inspirację (opcjonalne)
										</FormLabel>
										<FormControl>
											<FileUploader
												value={files}
												onValueChange={setFiles}
												dropzoneOptions={dropZoneConfig}
												className="relative bg-background rounded-md border-2 border-foreground p-2 hover:border-accent transition-all"
											>
												<FileInput
													id={uuidv4()}
													className="border-2 border-dashed border-muted-foreground/50 hover:border-primary/50 transition-colors"
												>
													<div className="flex items-center justify-center flex-col p-6 w-full">
														<motion.div
															animate={{
																y: [0, -10, 0],
															}}
															transition={{
																duration: 2,
																repeat: Infinity,
																ease: "easeInOut",
															}}
														>
															<CloudUpload className="text-primary w-8 h-8 mb-2" />
														</motion.div>
														<p className="mb-1 text-sm text-foreground font-primary">
															<span className="font-semibold">
																Naciśnij aby dodać
															</span>{" "}
															lub przeciągnij i upuść
														</p>
														<p className="text-xs text-muted-foreground">
															SVG, PNG, JPG lub PDF. Maksymalny rozmiar pliku 10
															MB
														</p>
													</div>
												</FileInput>
												<FileUploaderContent>
													{files &&
														files.length > 0 &&
														files.map((file, i) => (
															<motion.div
																key={file.name}
																initial={{ opacity: 0, y: 10 }}
																animate={{ opacity: 1, y: 0 }}
																transition={{ delay: i * 0.1 }}
															>
																<FileUploaderItem
																	index={i}
																	className="bg-secondary border-2 border-foreground hover:bg-muted transition-colors"
																>
																	<Paperclip className="h-4 w-4 stroke-current text-primary" />
																	<span className="font-text text-foreground">
																		{file.name}
																	</span>
																</FileUploaderItem>
															</motion.div>
														))}
												</FileUploaderContent>
											</FileUploader>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</motion.div>

						{/* Submit Button Section */}
						<motion.div
							className="flex gap-4 flex-col w-full md:w-max-width[80%] items-center justify-center pt-4"
							variants={itemVariants}
						>
							<motion.div
								className="w-full"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<motion.button
									type="submit"
									disabled={isSubmitting}
									className="bg-primary text-background font-primary text-base md:text-lg w-full px-4 md:px-8 py-3 md:py-4 uppercase border-2 border-foreground rounded-md cursor-pointer hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] disabled:hover:shadow-none flex items-center justify-center"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									{isSubmitting ? "Wysyłanie..." : "Wyślij"}
								</motion.button>
							</motion.div>

							<span className="text-foreground uppercase text-lg md:text-xl font-primary">
								LUB
							</span>

							<InstagramBtn
								text="Skontaktuj się przez Instagram"
								link="https://www.instagram.com/iovi.ink/"
							/>
						</motion.div>
					</form>
				</Form>

				{/* Decorative floating elements matching Hero section */}
				<motion.div
					className="absolute top-4 right-4 w-3 h-3 bg-accent border-2 border-foreground rounded-full"
					animate={{
						x: [0, 8, 0],
						y: [0, -8, 0],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<motion.div
					className="absolute bottom-4 left-4 w-2 h-2 bg-primary border-2 border-foreground transform rotate-45"
					animate={{
						x: [0, -6, 0],
						y: [0, 6, 0],
						rotate: [45, 225, 405],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1.5,
					}}
				/>

				<motion.div
					className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-secondary border-2 border-foreground rounded-full"
					animate={{
						scale: [1, 1.4, 1],
						opacity: [0.6, 1, 0.6],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 0.8,
					}}
				/>
			</motion.div>
		</motion.div>
	);
}
