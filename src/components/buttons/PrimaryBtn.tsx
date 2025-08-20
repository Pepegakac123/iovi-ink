import * as motion from "motion/react-client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import PopupForm from "../forms/PopupForm";

const PrimaryBtn = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				ease: "easeOut",
			}}
		>
			<Dialog>
				<DialogTrigger asChild>
					<motion.button
						className="bg-primary cursor-pointer text-background font-primary text-base md:text-lg w-full md:w-fit px-4 md:px-8 py-4 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-3 group transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
						Bezpłatna Konsultacja
					</motion.button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md border-2 border-foreground rounded-md shadow-[8px_8px_0px_0px_theme(colors.foreground)] bg-background">
					<DialogHeader>
						<DialogTitle className="text-foreground font-primary text-lg md:text-xl">
							Bezpłatna Konsultacja
						</DialogTitle>
						<DialogDescription className="text-muted-foreground font-text text-sm md:text-base">
							Napisz do mnie, a omówimy Twój pomysł na tatuaż. Odpowiem w ciągu
							24 godzin!
						</DialogDescription>
					</DialogHeader>
					<PopupForm />
				</DialogContent>
			</Dialog>
		</motion.div>
	);
};

export default PrimaryBtn;
