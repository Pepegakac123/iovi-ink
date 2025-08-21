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
import { containerVariants, itemVariants } from "@/lib/variants";
import {
	NameField,
	EmailField,
	PhoneField,
	DescriptionField,
	FormSection,
	AnimatedFieldWrapper,
} from "@/components/forms/ContactFormField";
import FloatingElements from "../FloatingElements";
import { socialLinks } from "@/Assets";

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

	return (
		<div className="w-full  mx-auto">
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
						<FormSection variant="main">
							<AnimatedFieldWrapper variant="main">
								<NameField form={form} variant="main" />
							</AnimatedFieldWrapper>

							<AnimatedFieldWrapper variant="main">
								<EmailField form={form} variant="main" />
							</AnimatedFieldWrapper>

							<AnimatedFieldWrapper variant="main">
								<PhoneField
									form={form}
									variant="main"
									formatPhone={formatPhone}
								/>
							</AnimatedFieldWrapper>
						</FormSection>

						{/* Large Text Area */}
						<AnimatedFieldWrapper variant="main">
							<DescriptionField form={form} variant="main" rows={6} />
						</AnimatedFieldWrapper>

						{/* File Upload Section */}
						<AnimatedFieldWrapper variant="main">
							<div className="space-y-2">
								<motion.label
									htmlFor="fileInput"
									className="text-foreground font-primary text-sm font-bold uppercase inline-block"
									variants={itemVariants}
								>
									Prześlij wzór
									<span className="text-xs text-muted-foreground font-normal normal-case ml-1">
										(Opcjonalne)
									</span>
								</motion.label>

								<motion.div variants={itemVariants}>
									<FileUploader
										value={files}
										onValueChange={setFiles}
										dropzoneOptions={config.files}
										className="relative bg-secondary border-2 border-dashed hover:border-accent border-foreground rounded-md"
									>
										{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
										<FileInput id="fileInput" className="">
											<div className="flex items-center justify-center flex-col p-8 w-full">
												<motion.div
													animate={{
														y: [0, -8, 0], // Ruch w górę i w dół
														scale: [1, 1.05, 1], // Lekkie powiększenie
													}}
													whileHover={{
														scale: 1.2,
														y: -5,
														rotate: 15,
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
												<p className="mb-1 text-sm text-foreground font-text">
													<span className="font-semibold">
														Kliknij aby przesłać
													</span>{" "}
													lub przeciągnij tutaj
												</p>
												<p className="text-xs text-muted-foreground">
													SVG, PNG, JPG, PDF (maks.{" "}
													{config.files.maxSize / (1024 * 1024)}MB, do{" "}
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
															key={`${file.name}-${i}`} // Unikalny key
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
																// Dla initial -> animate
																type: "spring",
																stiffness: 200,
																damping: 20,
															}}
															// ULEPSZONA ANIMACJA WYJŚCIA
														>
															<FileUploaderItem
																index={i}
																onRemove={removeFile} // DODANE
																className="bg-background border-2 border-foreground hover:bg-accent/20 transition-all duration-200 rounded-sm "
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
																</span>
															</FileUploaderItem>
														</motion.div>
													))}
											</AnimatePresence>
										</FileUploaderContent>
									</FileUploader>
								</motion.div>
							</div>
						</AnimatedFieldWrapper>

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
										<Loader2 className="h-5 w-5 animate-spin" />
										WYSYŁANIE...
									</>
								) : (
									<>
										WYŚLIJ
										<Send className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
									</>
								)}
							</motion.button>

							{/* Separator */}
							<motion.span
								className="text-foreground uppercase text-lg md:text-xl font-primary font-bold"
								initial={motionPresets.span.main.hidden}
								animate={motionPresets.span.main.visible}
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
								initial={motionPresets.div.main.hidden}
								animate={motionPresets.div.main.visible}
							>
								<InstagramBtn
									text="SKONTAKTUJ SIĘ PRZEZ INSTAGRAM"
									link={socialLinks.iovi.instagram}
								/>
							</motion.div>
						</motion.div>
					</motion.form>
				</Form>

				{/* Decorative Elements */}
				<FloatingElements variant="card" />
			</motion.div>
		</div>
	);
}
