// components/forms/PopupForm.tsx
"use client";

import React from "react";
import * as motion from "motion/react-client";
import { Form } from "@/components/ui/form";
import { Loader2, Paperclip, Send } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

import {
  FormSection,
  AnimatedFieldWrapper,
  NameField,
  EmailField,
  PhoneField,
  DescriptionField,
} from "@/components/forms/ContactFormField";

import { usePopupContactForm } from "@/hooks/useContactFormField";
import {
  getFormConfig,
  getFormStyles,
  getFormMotion,
} from "@/lib/config/form-config";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { socialLinks } from "@/lib/data";

// ===========================================
// POPUP FORM PROPS
// ===========================================

interface PopupFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  className?: string;
}

// ===========================================
// POPUP CONTACT FORM COMPONENT
// ===========================================

const PopupForm: React.FC<PopupFormProps> = ({
  onSuccess,
  onError,
  onComplete,
  className = "",
}) => {
  const {
    form,
    files,
    setFiles,
    isSubmitting,
    handleSubmit,
    removeFile,
    formatPhone,
  } = usePopupContactForm({
    onSuccess: (data) => {
      onSuccess?.(data);
      onComplete?.();
    },
    onError,
  });

  const config = getFormConfig("popup");
  const styles = getFormStyles("popup");
  const motionPresets = getFormMotion("popup");

  const onSubmit = form.handleSubmit(handleSubmit);

  const handleFilesChange = (newFiles: File[] | null) => {
    if (!newFiles) {
      setFiles([]);
      return;
    }

    const combinedFiles = [...(files || []), ...newFiles];

    if (combinedFiles.length > config.files.maxFiles) {
      const excessCount = combinedFiles.length - config.files.maxFiles;
      const limitedFiles = combinedFiles.slice(0, config.files.maxFiles);
      setFiles(limitedFiles);
      console.warn(
        `Usunięto ${excessCount} najstarszych plików. Maksymalnie ${config.files.maxFiles} plików w popup.`,
      );
    } else {
      setFiles(combinedFiles);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Form {...form}>
        <motion.form
          onSubmit={onSubmit}
          className="space-y-3" // Zmniejszony spacing ogólny dla oszczędności miejsca
          variants={motionPresets.form.popup}
          initial="hidden"
          animate="visible"
        >
          {/* ✅ ZMIANA UKŁADU: GRID NA DESKTOPACH
                      Na mobile (grid-cols-1) pola są pod sobą.
                      Na md+ (grid-cols-3) pola są w jednym rzędzie.
                    */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Imię */}
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
          </div>

          {/* Opis - Zostaje na całą szerokość */}
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
                  onValueChange={handleFilesChange}
                  dropzoneOptions={config.files}
                  inputId="popupFileInput"
                  className="relative bg-secondary border-2 border-dashed hover:border-accent border-foreground rounded-md"
                >
                  <FileInput>
                    {/* Zmniejszony padding i min-height dla oszczędności miejsca */}
                    <div className="flex flex-col items-center justify-center space-y-1 p-2 min-h-[70px]">
                      <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Paperclip className="h-4 w-4 text-primary" />
                      </motion.div>
                      <p className="text-xs font-primary text-foreground text-center leading-tight">
                        <span className="font-bold">
                          Kliknij lub przeciągnij
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground text-center">
                        Maks. {config.files.maxSize / (1024 * 1024)}MB,{" "}
                        {config.files.maxFiles} pliki
                      </p>
                    </div>
                  </FileInput>

                  <FileUploaderContent className="space-y-1 pb-1">
                    <AnimatePresence mode="popLayout">
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <motion.div
                            key={`popup-${file.name}-${file.size}-${i}`}
                            initial={{ opacity: 0, x: -15, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{
                              opacity: 0,
                              x: 15,
                              scale: 0.9,
                              height: 0,
                              marginTop: 0,
                              transition: {
                                duration: 0.2,
                                ease: "easeInOut",
                              },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                          >
                            <FileUploaderItem
                              index={i}
                              onRemove={removeFile}
                              className="bg-background border border-foreground hover:bg-accent/20 transition-all duration-200 rounded-sm py-1"
                            >
                              <Paperclip className="h-3 w-3 stroke-current text-primary" />
                              <span className="font-text text-foreground text-xs font-medium truncate">
                                {file.name}
                                <span className="text-xs text-muted-foreground ml-1">
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

          {/* Submit & Buttons Section */}
          <motion.div
            className="flex gap-2 flex-col w-full items-center justify-center pt-1"
            variants={motionPresets.field.popup}
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-center">
              {/* Przycisk Wyślij */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-accent cursor-pointer text-background font-primary text-xs w-full px-3 py-2 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary transition-colors duration-150 h-9"
                whileHover={
                  !isSubmitting
                    ? {
                        scale: 1.01,
                        boxShadow: "2px 2px 0px 0px var(--foreground)",
                      }
                    : {}
                }
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
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
                className="text-foreground uppercase text-xs font-primary font-bold text-center"
                variants={motionPresets.span.popup}
              >
                LUB
              </motion.span>

              {/* Przycisk Instagram */}
              <motion.a
                href={socialLinks.iovi.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full"
              >
                <motion.button
                  type="button"
                  className="bg-secondary hover:bg-muted cursor-pointer text-foreground font-primary text-xs w-full px-3 py-2 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 h-9"
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "2px 2px 0px 0px var(--foreground)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Instagram
                  <Image
                    src={ICONS.instagram}
                    alt="IG"
                    width={14}
                    height={14}
                    className="group-hover:filter group-hover:brightness-110"
                  />
                </motion.button>
              </motion.a>
            </div>

            <motion.p
              className="text-[10px] text-muted-foreground text-center max-w-md mx-auto leading-tight mt-1"
              variants={motionPresets.field.main}
            >
              Zgoda na{" "}
              <a
                href="/polityka-prywatnosci"
                className="text-primary hover:text-accent underline"
              >
                politykę prywatności
              </a>
              . Chronione przez reCAPTCHA.
            </motion.p>
          </motion.div>
        </motion.form>
      </Form>
    </div>
  );
};

export default PopupForm;
