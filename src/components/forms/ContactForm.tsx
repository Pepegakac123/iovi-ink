// src/components/forms/ContactForm.tsx - FIXED: Akumulacja plików zamiast zastępowania

"use client";
import React from "react";
import * as motion from "motion/react-client";
import { Form } from "@/components/ui/form";
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/file-upload";
import { LuHardDriveUpload } from "react-icons/lu";
import { Paperclip, Send, Loader2, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import InstagramBtn from "../buttons/InstragramBtn";

// Imports from refactored structure
import { useMainContactForm } from "@/hooks/useContactFormField";
import { getFormStyles, getFormMotion } from "@/lib/config/form-config";
import {
	NameField,
	EmailField,
	PhoneField,
	DescriptionField,
	FormSection,
	AnimatedFieldWrapper,
} from "@/components/forms/ContactFormField";
import FloatingElements from "../FloatingElements";
import { socialLinks } from "@/lib/data";

// ===========================================
// MAIN CONTACT FORM COMPONENT
// ===========================================

export default function ContactForm() {
	// Use the refactored hook for all business logic
	const {
		form,
		isSubmitting,
		files,
		setFiles,
		removeFile,
		onSubmit,
		formatPhone,
		config,
	} = useMainContactForm({
		onSuccess: (data) => {
			console.log("Form submitted successfully:", data);
		},
		onError: (error) => {
			console.error("Form submission failed:", error);
		},
	});

	// Get styles and motion for main variant
	const styles = getFormStyles("main");
	const motionPresets = getFormMotion("main");

	const handleFilesChange = (newFiles: File[] | null) => {
		if (!newFiles || newFiles.length === 0) {
			return;
		}

		// ✅ Sprawdź czy to są nowe pliki czy zastąpienie
		if (!files || files.length === 0) {
			// Pierwsza batch plików - ustaw bezpośrednio
			setFiles(newFiles);
			return;
		}

		// ✅ Dodaj nowe pliki do istniejących (akumulacja)
		const existingFiles = files || [];
		const combinedFiles = [...existingFiles];

		// Dodaj tylko te pliki, które jeszcze nie istnieją (sprawdź po nazwie i rozmiarze)
		for (const newFile of newFiles) {
			const isDuplicate = existingFiles.some(
				(existingFile) =>
					existingFile.name === newFile.name &&
					existingFile.size === newFile.size &&
					existingFile.lastModified === newFile.lastModified,
			);

			if (!isDuplicate) {
				combinedFiles.push(newFile);
			}
		}

		// ✅ Sprawdź limit plików
		if (combinedFiles.length > config.files.maxFiles) {
			const excessCount = combinedFiles.length - config.files.maxFiles;
			// Ogranicz do maksymalnej liczby plików (zachowaj najnowsze)
			const limitedFiles = combinedFiles.slice(-config.files.maxFiles);
			setFiles(limitedFiles);

			// Pokaż informację o limicie
			if (excessCount > 0) {
				// Można dodać toast tutaj jeśli potrzebne
				console.warn(
					`Maksymalnie ${config.files.maxFiles} plików. Usunięto ${excessCount} najstarszych.`,
				);
			}
		} else {
			setFiles(combinedFiles);
		}
	};

	return (
		<div className="w-full mx-auto">
			{/* Brutal Design Form Container */}
			<motion.div
				className={styles.container}
				initial={motionPresets.container.main.hidden}
				animate={motionPresets.container.main.visible}
				whileHover={motionPresets.container.main.hover}
			>
				<Form {...form}>
					<motion.form
						onSubmit={onSubmit}
						className={styles.spacing}
						variants={motionPresets.form.main}
						initial="hidden"
						animate="visible"
					>
						{/* Header Row: Name, Email, Phone */}
						<motion.div variants={motionPresets.field.main}>
							<FormSection variant="main">
								<AnimatedFieldWrapper variant="main">
									<NameField form={form} variant="main" />
								</AnimatedFieldWrapper>

								<AnimatedFieldWrapper variant="main">
									<EmailField form={form} variant="main" />
								</AnimatedFieldWrapper>

								<motion.div
									variants={motionPresets.field.main}
									className="md:col-span-2 xl:col-span-1"
								>
									<PhoneField
										form={form}
										variant="main"
										formatPhone={formatPhone}
									/>
								</motion.div>
							</FormSection>
						</motion.div>

						{/* Large Text Area */}
						<motion.div variants={motionPresets.field.main}>
							<DescriptionField form={form} variant="main" rows={6} />
						</motion.div>

						{/* ✅ FIXED: File Upload Section z poprawnym handlingiem */}
						<motion.div variants={motionPresets.field.main}>
							<div className="space-y-2">
								<motion.label
									htmlFor="fileInput"
									className="text-foreground font-primary text-sm font-bold uppercase inline-block"
								>
									Prześlij wzór
									<span className="text-xs text-muted-foreground font-normal normal-case ml-1">
										(Opcjonalne - Max. {config.files.maxSize / (1024 * 1024)}MB,
										do {config.files.maxFiles} plików)
									</span>
								</motion.label>

								<motion.div>
									<FileUploader
										value={files}
										onValueChange={handleFilesChange}
										dropzoneOptions={config.files}
										className="relative bg-secondary border-3 border-dashed hover:border-accent border-foreground rounded-md"
									>
										{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
										<FileInput id="fileInput" className="">
											<div className="flex items-center justify-center flex-col p-8 w-full">
												<motion.div
													animate={{
														y: [0, -8, 0],
														scale: [1, 1.05, 1],
													}}
													whileHover={{
														scale: 1.2,
														y: -4,
														rotate: 12,
														transition: {
															type: "spring",
															stiffness: 400,
															damping: 15,
														},
													}}
													transition={{
														duration: 2.5,
														repeat: Infinity,
														ease: "easeInOut",
														repeatType: "reverse",
													}}
												>
													<LuHardDriveUpload className="text-primary h-10 w-10" />
												</motion.div>
												<p className="mb-2 text-sm text-foreground font-text text-center">
													<span className="font-semibold">
														Kliknij aby wybrać
													</span>{" "}
													lub przeciągnij i upuść
												</p>
												<p className="text-xs text-muted-foreground text-center">
													(Max. {config.files.maxSize / (1024 * 1024)}MB, do{" "}
													{config.files.maxFiles} plików)
												</p>
											</div>
										</FileInput>

										<FileUploaderContent className="space-y-2 pb-2">
											<AnimatePresence mode="popLayout">
												{files &&
													files.length > 0 &&
													files.map((file, i) => (
														<motion.div
															key={`${file.name}-${file.size}-${i}`} // ✅ Lepszy key
															initial={{ opacity: 0, x: -20, scale: 0.8 }}
															animate={{ opacity: 1, x: 0, scale: 1 }}
															exit={{
																opacity: 0,
																x: 20,
																scale: 0.8,
																height: 0,
																marginTop: 0,
																transition: {
																	duration: 0.3,
																	ease: "easeInOut",
																},
															}}
															transition={{
																type: "spring",
																stiffness: 200,
																damping: 20,
															}}
														>
															<FileUploaderItem
																index={i}
																onRemove={removeFile}
																className="bg-background border-2 border-foreground hover:bg-accent/20 transition-all duration-200 rounded-sm"
															>
																<motion.div
																	animate={{ rotate: [0, 5, -5, 0] }}
																	transition={{
																		duration: 2,
																		repeat: Infinity,
																		ease: "easeInOut",
																	}}
																>
																	<Paperclip className="h-4 w-4 stroke-current text-primary" />
																</motion.div>
																<span className="font-text text-foreground text-sm font-medium">
																	{file.name}
																	<span className="text-xs text-muted-foreground ml-2">
																		({(file.size / 1024 / 1024).toFixed(1)}MB)
																	</span>
																</span>
															</FileUploaderItem>
														</motion.div>
													))}
											</AnimatePresence>
										</FileUploaderContent>
									</FileUploader>
								</motion.div>
							</div>
						</motion.div>

						{/* Submit Section */}
						<motion.div
							className="flex gap-4 flex-col w-full items-center justify-center pt-6"
							variants={motionPresets.field.main}
						>
							{/* Submit Button */}
							<motion.button
								type="submit"
								disabled={isSubmitting}
								className="bg-primary cursor-pointer text-background font-primary text-base md:text-lg w-full px-4 md:px-8 py-4 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
								whileHover={
									!isSubmitting
										? {
												scale: 1.05,
												backgroundColor: "var(--accent)",
												boxShadow: "4px 4px 0px 0px var(--foreground)",
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
								{isSubmitting ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Wysyłam...
									</>
								) : (
									<>
										<Send className="w-5 h-5" />
										Wyślij wiadomość
									</>
								)}
							</motion.button>

							<motion.span
								className="text-foreground uppercase text-lg md:text-xl font-primary font-bold"
								variants={motionPresets.span.main}
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
								className="w-full flex justify-center"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<InstagramBtn
									link={socialLinks.iovi.instagram}
									text="Napisz na Instagramie"
								/>
							</motion.div>

							{/* Footer Text */}
							<motion.p className="paragraph-small-muted text-center max-w-md">
								Otrzymasz odpowiedź w ciągu 24 godzin. Pierwsza konsultacja jest{" "}
								<span className="text-primary font-semibold">bezpłatna</span>.
							</motion.p>
						</motion.div>

						{/* Floating Elements */}
						<FloatingElements variant="section" />
					</motion.form>
				</Form>
			</motion.div>
		</div>
	);
}
