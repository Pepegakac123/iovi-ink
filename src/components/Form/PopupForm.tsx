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
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import { formatPhoneNumber } from "@/lib/utils";
import { CloudUpload, Paperclip } from "lucide-react";
import { DropzoneOptions } from "react-dropzone";
import InstagramBtn from "../buttons/InstragramBtn";
import Image from "next/image";
import { LuHardDriveUpload } from "react-icons/lu";

const formSchema = z.object({
	name_surname: z.string().min(1, "Imię i nazwisko są wymagane"),
	email: z.string().email("Nieprawidłowy adres email"),
	phone_number: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val) return true;
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

export default function PopupForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [files, setFiles] = useState<File[] | null>(null);
	const { executeRecaptcha } = useRecaptcha();

	const dropZoneConfig = {
		maxFiles: 3, // Zmniejszone z 5 na 3
		maxSize: 1024 * 1024 * 5, // Zmniejszone z 10MB na 5MB
		multiple: true,
		accept: {
			"image/jpeg": [".jpg", ".jpeg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
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
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);

		try {
			const recaptchaToken = await executeRecaptcha("contact_form");
			const formData = new FormData();

			formData.append("name_surname", values.name_surname);
			formData.append("email", values.email);
			formData.append(
				"phone_number",
				values.phone_number ? values.phone_number.replace(/\s/g, "") : "",
			);
			formData.append("project_description", values.project_description);
			formData.append("file_input", values.file_input || "");
			formData.append("recaptcha_token", recaptchaToken);

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
				staggerChildren: 0.06, // Zmniejszone z 0.08
			},
		},
	} as Variants;

	const itemVariants = {
		hidden: { opacity: 0, y: 12 }, // Zmniejszone z 15
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 120,
				damping: 12,
			},
		},
	} as Variants;

	const labelVariants = {
		rest: { y: 0, color: "hsl(var(--foreground))" },
		hover: {
			y: -1,
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
			scale: 1.01,
			borderColor: "hsl(var(--primary))",
			transition: { type: "spring", stiffness: 400, damping: 30 },
		},
		focus: {
			scale: 1.01,
			borderColor: "hsl(var(--primary))",
			boxShadow: "0 0 0 2px hsl(var(--primary) / 0.2)",
			transition: { type: "spring", stiffness: 400, damping: 30 },
		},
	} as Variants;

	return (
		<div className="w-full">
			<Form {...form}>
				<motion.form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-3" // Zmniejszone z space-y-4
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{/* Imię i nazwisko */}
					<motion.div variants={itemVariants}>
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
											<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block">
												Imię i nazwisko*
											</FormLabel>
										</motion.div>
										<FormControl>
											<motion.div variants={inputVariants}>
												<Input
													placeholder="Anna Kowalska"
													className="bg-secondary/70 border-2 border-foreground font-text h-9 rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background focus:placeholder-transparent" // Zmniejszone z h-10 na h-9
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

					{/* Email */}
					<motion.div variants={itemVariants}>
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
											<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block">
												E-mail*
											</FormLabel>
										</motion.div>
										<FormControl>
											<motion.div variants={inputVariants}>
												<Input
													placeholder="anna@wp.pl"
													type="email"
													className="bg-secondary/70 border-2 border-foreground font-text h-9 rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background focus:placeholder-transparent"
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

					{/* Telefon */}
					<motion.div variants={itemVariants}>
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
											<FormLabel className="text-foreground font-primary text-sm font-bold uppercase inline-block">
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
													className="bg-secondary/70 border-2 border-foreground font-text h-9 rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background focus:placeholder-transparent"
													value={field.value || ""}
													onChange={(e) => {
														const formatted = formatPhoneNumber(e.target.value);
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

					{/* Opis projektu */}
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
												Jak mogę ci pomóc?*
											</FormLabel>
										</motion.div>
										<FormControl>
											<motion.div variants={inputVariants}>
												<Textarea
													placeholder="Krótko opisz swój projekt..."
													className="bg-secondary/70 border-2 border-foreground font-text min-h-16 max-h-24 resize-none rounded-md transition-all duration-200 hover:bg-secondary focus:bg-background focus:placeholder-transparent" // Zmniejszone min-h-20 na min-h-16, max-h-32 na max-h-24
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

					{/* File uploader - zmniejszony */}
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
											Prześlij wzór
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
												className="relative bg-secondary/30 rounded-md border-2 border-foreground p-1 transition-all duration-200" // Zmniejszone z p-2 na p-1.5
											>
												{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
												<FileInput
													id="mainContactFileInput"
													className="border-2 border-dashed border-foreground/40 hover:border-primary/60 transition-colors duration-200 bg-background/30 rounded-md"
												>
													<div className="flex items-center justify-center flex-col p-1 w-full">
														{" "}
														{/* Zmniejszone z p-6 na p-3 */}
														<motion.div
															animate={{
																y: [0, -6, 0], // Zmniejszone z -8 na -6
															}}
															transition={{
																duration: 2.5,
																repeat: Infinity,
																ease: "easeInOut",
															}}
															whileHover={{
																y: -8, // Zmniejszone z -12 na -8
																rotate: [0, 3, -3, 0], // Zmniejszone z 5, -5 na 3, -3
																transition: { duration: 0.3 },
															}}
														>
															<LuHardDriveUpload className="text-primary w-6 h-6 mb-2" />{" "}
															{/* Zmniejszone z w-8 h-8 mb-3 */}
														</motion.div>
														<motion.p
															className="mb-1 text-xs text-foreground font-primary font-bold" // Zmniejszone z text-sm
															initial={{ opacity: 0.8 }}
															whileHover={{ opacity: 1, scale: 1.03 }} // Zmniejszone z 1.05 na 1.03
														>
															<span className="font-bold">
																Naciśnij aby dodać
															</span>{" "}
															lub przeciągnij
														</motion.p>
														<p className="text-xs text-muted-foreground font-text">
															PNG, JPG, PDF. Max 5 MB, max 3 pliki{" "}
															{/* Zaktualizowana informacja */}
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
																	scale: 1.01, // Zmniejszone z 1.02
																	y: -1, // Zmniejszone z -2
																	transition: {
																		type: "spring",
																		stiffness: 400,
																	},
																}}
															>
																<FileUploaderItem
																	index={i}
																	className="bg-background border-2 border-foreground hover:bg-accent/20 transition-all duration-200 rounded-sm mt-1.5 text-xs" // Zmniejszone mt-2 na mt-1.5, dodane text-xs
																>
																	<motion.div
																		animate={{ rotate: [0, 3, -3, 0] }} // Zmniejszone z 5, -5
																		transition={{
																			duration: 2,
																			repeat: Infinity,
																			ease: "easeInOut",
																			delay: i * 0.3,
																		}}
																	>
																		<Paperclip className="h-3 w-3 stroke-current text-primary" />{" "}
																		{/* Zmniejszone z h-4 w-4 */}
																	</motion.div>
																	<span className="font-text text-foreground text-xs font-medium truncate max-w-32">
																		{" "}
																		{/* Dodane truncate i max-w */}
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

					{/* Submit Button */}
					<motion.div className="pt-2" variants={itemVariants}>
						{" "}
						{/* Zmniejszone z pt-4 na pt-3 */}
						<motion.button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary cursor-pointer text-primary-foreground font-primary text-sm w-full px-6 py-2.5 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200" // Zmniejszone py-3 na py-2.5
							whileHover={
								!isSubmitting
									? {
											scale: 1.02,
											backgroundColor: "var(--accent)",
											boxShadow: "3px 3px 0px 0px var(--foreground)",
											transition: { duration: 0.2 },
										}
									: {}
							}
							whileTap={
								!isSubmitting
									? {
											scale: 0.98,
											transition: { duration: 0.1 },
										}
									: {}
							}
						>
							{isSubmitting ? "WYSYŁANIE..." : "WYŚLIJ WIADOMOŚĆ"}
						</motion.button>
					</motion.div>

					{/* Separator */}
					<motion.div
						className="flex items-center justify-center py-1" // Zmniejszone padding
						variants={itemVariants}
					>
						<div className="flex-1 h-px bg-foreground/20"></div>
						<span className="px-3 text-xs font-primary font-bold text-muted-foreground uppercase">
							LUB
						</span>
						<div className="flex-1 h-px bg-foreground/20"></div>
					</motion.div>

					{/* Instagram Button */}
					<motion.div variants={itemVariants}>
						<motion.button
							type="button"
							className="bg-secondary cursor-pointer text-foreground font-primary text-sm w-full px-6 py-2.5 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-2 group transition-all duration-200"
							whileHover={{
								scale: 1.02,
								backgroundColor: "var(--muted)",
								boxShadow: "3px 3px 0px 0px var(--foreground)",
								transition: { duration: 0.2 },
							}}
							whileTap={{
								scale: 0.98,
								transition: { duration: 0.1 },
							}}
						>
							<span>Napisz na Instagramie</span>
							<motion.div
								className="flex items-center justify-center"
								whileHover={{
									rotate: 10,
									scale: 1.1,
									transition: { duration: 0.2 },
								}}
							>
								<Image
									src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/instagram_ikona.svg"
									alt="Instagram"
									width={24}
									height={24}
									className="group-hover:filter group-hover:brightness-110"
								/>
							</motion.div>
						</motion.button>
					</motion.div>
				</motion.form>
			</Form>
		</div>
	);
}
