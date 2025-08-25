"use client";
import React from "react";
import * as motion from "motion/react-client";
import { X } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const CookieConsent: React.FC = () => {
	const { hasConsent, acceptCookies, declineCookies, isLoading } =
		useCookieConsent();

	if (isLoading || hasConsent !== null) {
		return null;
	}
	console.log("CookieConsent render:", { hasConsent, isLoading });
	return (
		<motion.div
			className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-foreground text-background border-t-2 border-primary"
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto max-w-4xl">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					{/* Text Content */}
					<div className="flex-1">
						<motion.h3
							className="font-primary text-lg mb-2 text-background"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							Używamy plików cookies
						</motion.h3>
						<motion.p
							className="text-sm text-background/80 mb-3 md:mb-0"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							Nasza strona używa plików cookies w celu analizy ruchu i poprawy
							doświadczeń użytkowników. Cookies analityczne pomagają nam
							zrozumieć, jak korzystasz z naszej strony.{" "}
							<a
								href="/polityka-prywatnosci"
								className="underline text-primary hover:text-accent"
							>
								Dowiedz się więcej
							</a>
						</motion.p>
					</div>

					{/* Buttons */}
					<motion.div
						className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
					>
						<button
							type="button"
							onClick={acceptCookies}
							className="bg-primary text-foreground px-4 py-2 rounded-md font-primary text-sm hover:bg-accent transition-colors border-2 border-primary hover:border-accent"
						>
							Akceptuj wszystkie
						</button>
						<button
							type="button"
							onClick={declineCookies}
							className="bg-transparent text-background px-4 py-2 rounded-md font-primary text-sm hover:bg-background/10 transition-colors border-2 border-background/20"
						>
							Tylko niezbędne
						</button>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default CookieConsent;
