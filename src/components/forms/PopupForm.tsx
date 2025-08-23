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
import { Paperclip, Send, Loader2 } from "lucide-react";
import { AnimatePresence } from "motion/react";

// Imports from refactored structure
import { usePopupContactForm } from "@/hooks/useContactFormField";
import { getFormStyles, getFormMotion } from "@/lib/config/form-config";
import {
	NameField,
	EmailField,
	PhoneField,
	DescriptionField,
	FormSection,
	AnimatedFieldWrapper,
} from "@/components/forms/ContactFormField";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { socialLinks } from "@/lib/data";

// ===========================================
// POPUP FORM COMPONENT
// ===========================================

export default function PopupForm() {
	// Use the refactored hook for popup variant
	const {
		form,
		isSubmitting,
		files,
		setFiles,
		removeFile,
		onSubmit,
		formatPhone,
		config,
	} = usePopupContactForm({
		onSuccess: (data) => {
			console.log("Popup form submitted successfully:", data);
			// Modal może zostać zamknięty tutaj
		},
		onError: (error) => {
			console.error("Popup form submission failed:", error);
		},
	});

	// Get styles and motion for popup variant
	const styles = getFormStyles("popup");
	const motionPresets = getFormMotion("popup");

	return (
		<div className="w-full">
			<Form {...form}>
				<motion.form
					onSubmit={onSubmit}
					className={styles.spacing}
					variants={motionPresets.form.popup} // ← ZMIANA: używamy spójnego systemu
					initial="hidden"
					animate="visible"
				>
					{/* Imię i nazwisko */}
					<motion.div variants={motionPresets.field.popup}>
						<FormSection variant="popup">
							<AnimatedFieldWrapper variant="popup">
								<NameField form={form} variant="popup" />
							</AnimatedFieldWrapper>
						</FormSection>
					</motion.div>

					{/* Email */}
					<motion.div variants={motionPresets.field.popup}>
						<FormSection variant="popup">
							<AnimatedFieldWrapper variant="popup">
								<EmailField form={form} variant="popup" />
							</AnimatedFieldWrapper>
						</FormSection>
					</motion.div>

					{/* Telefon */}
					<motion.div variants={motionPresets.field.popup}>
						<FormSection variant="popup">
							<AnimatedFieldWrapper variant="popup">
								<PhoneField
									form={form}
									variant="popup"
									formatPhone={formatPhone}
								/>
							</AnimatedFieldWrapper>
						</FormSection>
					</motion.div>

					{/* Opis projektu */}
					<motion.div variants={motionPresets.field.popup}>
						<FormSection variant="popup">
							<AnimatedFieldWrapper variant="popup">
								<DescriptionField form={form} variant="popup" rows={2} />
							</AnimatedFieldWrapper>
						</FormSection>
					</motion.div>

					{/* File Upload Section */}
					<motion.div variants={motionPresets.field.popup}>
						<div className="space-y-1">
							<motion.label
								htmlFor="popupFileInput"
								className="text-foreground font-primary text-xs font-bold uppercase inline-block"
							>
								Prześlij wzór
								<span className="text-xs text-muted-foreground font-normal normal-case ml-1">
									(Opcjonalne)
								</span>
							</motion.label>
							<motion.div>
								<FileUploader
									value={files}
									onValueChange={setFiles}
									dropzoneOptions={config.files}
									className="relative bg-secondary border-2 border-dashed hover:border-accent border-foreground rounded-md"
								>
									{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
									<FileInput id="popupFileInput" className="">
										<div className="flex items-center justify-center flex-col p-3 w-full">
											<motion.div
												animate={{
													y: [0, -4, 0],
													scale: [1, 1.02, 1],
												}}
												whileHover={{
													scale: 1.1,
													y: -2,
													rotate: 8,
													transition: {
														type: "spring",
														stiffness: 400,
														damping: 15,
													},
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
													repeatType: "reverse",
												}}
											>
												<LuHardDriveUpload className="text-primary h-6 w-6" />
											</motion.div>
											<p className="mb-1 text-xs text-foreground font-text text-center">
												<span className="font-semibold">Kliknij</span> lub
												przeciągnij
											</p>
											<p className="text-xs text-muted-foreground text-center">
												Do {config.files.maxSize / (1024 * 1024)}MB, max.{" "}
												{config.files.maxFiles} plików
											</p>
										</div>
									</FileInput>

									<FileUploaderContent className="space-y-1 pb-1">
										<AnimatePresence mode="popLayout">
											{files &&
												files.length > 0 &&
												files.map((file, i) => (
													<motion.div
														key={`${file.name}-${i}`}
														initial={{ opacity: 0, x: -10, scale: 0.95 }}
														animate={{ opacity: 1, x: 0, scale: 1 }}
														exit={{
															opacity: 0,
															x: 10,
															scale: 0.95,
															height: 0,
															marginTop: 0,
															transition: {
																duration: 0.15,
																ease: "easeInOut",
															},
														}}
														transition={{
															type: "spring",
															stiffness: 250,
															damping: 25,
														}}
													>
														<FileUploaderItem
															index={i}
															onRemove={removeFile}
															className="bg-background border border-foreground hover:bg-accent/20 transition-all duration-150 rounded text-xs py-1 px-2"
														>
															<motion.div
																animate={{ rotate: [0, 2, -2, 0] }}
																transition={{
																	duration: 1.2,
																	repeat: Infinity,
																	ease: "easeInOut",
																}}
															>
																<Paperclip className="h-3 w-3 stroke-current text-primary" />
															</motion.div>
															<span className="font-text text-foreground text-xs font-medium truncate">
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
					</motion.div>

					{/* Submit Button */}
					<motion.div
						className="flex gap-2 flex-col w-full items-center justify-center pt-2"
						variants={motionPresets.field.popup}
					>
						<motion.button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary cursor-pointer text-background font-primary text-xs w-full px-3 py-2 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
							whileHover={
								!isSubmitting
									? {
											scale: 1.01,
											backgroundColor: "var(--accent)",
											boxShadow: "2px 2px 0px 0px var(--foreground)",
											transition: { duration: 0.15 },
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
									<Loader2 className="h-3 w-3 animate-spin" />
									WYSYŁANIE...
								</>
							) : (
								<>
									WYŚLIJ
									<Send className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
								</>
							)}
						</motion.button>

						<motion.span
							className="text-foreground uppercase text-xs font-primary font-bold"
							variants={motionPresets.span.popup}
							whileHover={{
								scale: 1.03,
								color: "hsl(var(--primary))",
								transition: { type: "spring", stiffness: 400 },
							}}
						>
							LUB
						</motion.span>

						{/* Instagram Button */}
						<motion.a
							href={socialLinks.iovi.instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block w-full"
						>
							<motion.div className="w-full" variants={motionPresets.div.popup}>
								<motion.button
									type="button"
									className="bg-secondary cursor-pointer text-foreground font-primary text-xs w-full px-3 py-2 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
									whileHover={{
										scale: 1.01,
										backgroundColor: "var(--secondary)",
										boxShadow: "2px 2px 0px 0px var(--foreground)",
										transition: { duration: 0.15 },
									}}
									whileTap={{
										scale: 0.98,
										transition: { duration: 0.1 },
									}}
								>
									Napisz na Instagramie
									<Image
										src={ICONS.instagram}
										alt="Instagram"
										width={16}
										height={16}
										className="group-hover:filter group-hover:brightness-110"
									/>
								</motion.button>
							</motion.div>
						</motion.a>

						<motion.p
							className="text-xs text-muted-foreground text-center mt-1"
							variants={motionPresets.field.popup}
						>
							Odpowiem w ciągu 24 godzin!
						</motion.p>
					</motion.div>
				</motion.form>
			</Form>
		</div>
	);
}
