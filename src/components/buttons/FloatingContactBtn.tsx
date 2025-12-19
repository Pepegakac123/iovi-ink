"use client";

import React, { useState, useEffect } from "react";
import * as motion from "motion/react-client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import PopupForm from "@/components/forms/PopupForm";
import { MessageSquareText, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export const FloatingContactBtn = () => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {isVisible && (
          <DialogTrigger asChild>
            <motion.button
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              // ✅ ZMIANA: bottom-32 na mobile (żeby być NAD navbarem), cursor-pointer
              className="fixed bottom-32 right-4 md:bottom-8 md:right-8 z-50 group flex items-center justify-center cursor-pointer"
              aria-label="Otwórz formularz kontaktowy"
            >
              {/* Dymek z tekstem (tylko desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
                className="hidden md:flex absolute right-full mr-4 bg-background border-2 border-foreground px-3 py-2 rounded-md whitespace-nowrap shadow-[4px_4px_0px_0px_var(--foreground)] items-center gap-2"
              >
                <span className="font-primary text-xs uppercase font-bold text-foreground">
                  Masz pomysł?
                </span>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {/* Strzałka dymku */}
                <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-3 h-3 bg-background border-t-2 border-r-2 border-foreground rotate-45" />
              </motion.div>

              {/* Główny przycisk */}
              <div className="relative bg-primary text-background border-2 border-foreground p-3 md:p-4 rounded-full shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
                <MessageSquareText className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5px]" />

                {/* ✅ ZMIANA: Powiadomienie z numerem 1 */}
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-accent border border-foreground items-center justify-center text-[10px] font-bold text-foreground leading-none">
                    1
                  </span>
                </span>
              </div>
            </motion.button>
          </DialogTrigger>
        )}
      </AnimatePresence>

      {/* Modal Content */}
      <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 gap-0 border-2 border-foreground bg-background shadow-[8px_8px_0px_0px_var(--foreground)] sm:rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b-2 border-foreground bg-secondary/50">
          <div className="space-y-1">
            <DialogTitle className="font-primary text-xl md:text-2xl uppercase font-bold text-foreground">
              Napisz do mnie
            </DialogTitle>
            <DialogDescription className="font-text text-xs md:text-sm text-muted-foreground">
              Opisz swój pomysł, a ja zajmę się resztą.
            </DialogDescription>
          </div>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <PopupForm onComplete={() => setOpen(false)} className="mx-auto" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
