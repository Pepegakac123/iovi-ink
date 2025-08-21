import React from "react";
import * as motion from "motion/react-client";
import Image from "next/image";
import { Variants } from "motion";
import { FooterMenuLinks, serviceLinks, socialLinks } from "@/Assets";
import { ICONS } from "@/lib/icons";

const Footer = () => {
	const containerVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				staggerChildren: 0.1,
				ease: "easeOut",
			},
		},
	} as Variants;

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	return (
		<motion.footer
			className="bg-foreground text-background py-12 mt-20 overflow-hidden"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
		>
			<div className="container mx-auto px-4">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Logo & Description Column */}
					<motion.div
						className="lg:col-span-1 flex flex-col items-center sm:items-start"
						variants={itemVariants}
					>
						<motion.a
							href="/"
							className="inline-block mb-6 group"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Image
								src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/iovi-high-resolution-logo-transparent.png"
								alt="Iovi Logo"
								width={150}
								height={128}
								className=" group-hover:opacity-90 transition-opacity duration-300"
							/>
						</motion.a>

						<p className="text-background/80 text-base leading-relaxed mb-6 w-full sm:max-w-[280px]">
							Tworzę tatuaże w studiu Lewus Ink w Mszanie Dolnej. Każdy projekt
							to dla mnie wyzwanie artystyczne, nie tylko techniczna realizacja.
						</p>

						{/* Instagram Button */}
						<motion.a
							href={socialLinks.iovi.instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block w-full"
						>
							<motion.button
								type="button"
								className="bg-secondary cursor-pointer text-foreground font-primary text-sm w-full sm:w-fit px-2 py-2 uppercase border-2 border-background rounded-md flex items-center justify-center gap-3 group"
								whileHover={{
									scale: 1.05,
									backgroundColor: "var(--muted)",
									transition: { duration: 0.2 },
								}}
								whileTap={{
									scale: 0.98,
									transition: { duration: 0.1 },
								}}
							>
								<span>ZOBACZ INSTAGRAM</span>
								<motion.div
									className="flex items-center justify-center"
									whileHover={{
										rotate: 10,
										scale: 1.1,
										transition: { duration: 0.2 },
									}}
								>
									<Image
										src={ICONS.instagram}
										alt="Instagram"
										width={26}
										height={26}
										className="group-hover:filter group-hover:brightness-110"
									/>
								</motion.div>
							</motion.button>
						</motion.a>
					</motion.div>

					{/* Główne Menu Column */}
					<motion.div variants={itemVariants}>
						<h3 className="text-background font-primary text-lg mb-6 relative">
							Główne Menu
							<div className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded"></div>
						</h3>
						<nav className="space-y-3">
							{FooterMenuLinks.map((link, index) => (
								<motion.a
									key={link.href}
									href={link.href}
									className="block text-background/80 hover:text-primary transition-colors duration-300 text-base group"
									whileHover={{ x: 4 }}
									transition={{ type: "spring", stiffness: 400, damping: 25 }}
								>
									<span className="group-hover:border-b border-primary/50 pb-1">
										{link.name}
									</span>
								</motion.a>
							))}
						</nav>
					</motion.div>

					{/* Usługi Column */}
					<motion.div variants={itemVariants}>
						<h3 className="text-background font-primary text-lg mb-6 relative">
							Usługi
							<div className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded"></div>
						</h3>
						<nav className="space-y-3">
							{serviceLinks.map((link, index) => (
								<motion.a
									key={link.href}
									href={link.href}
									className="block text-background/80 hover:text-accent transition-colors duration-300 text-base group"
									whileHover={{ x: 4 }}
									transition={{ type: "spring", stiffness: 400, damping: 25 }}
								>
									<span className="group-hover:border-b border-accent/50 pb-1">
										{link.name}
									</span>
								</motion.a>
							))}
						</nav>
					</motion.div>

					{/* Skontaktuj Się Column */}
					<motion.div variants={itemVariants}>
						<h3 className="text-background font-primary text-lg mb-6 relative">
							Skontaktuj Się
							<div className="absolute -bottom-2 left-0 w-8 h-1 bg-secondary rounded"></div>
						</h3>

						<div className="space-y-4">
							{/* Email */}
							<motion.a
								href="mailto:iovi@kontakt.pl"
								className="flex items-center gap-3 text-background/80 hover:text-secondary transition-colors duration-300 group"
								whileHover={{ x: 4 }}
								transition={{ type: "spring", stiffness: 400, damping: 25 }}
							>
								<Image
									src={ICONS.envelope}
									alt="Email"
									width={24}
									height={24}
									className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="text-base">iovi@kontakt.pl</span>
							</motion.a>

							{/* Instagram Profile */}
							<motion.a
								href={socialLinks.iovi.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 text-background/80 hover:text-secondary transition-colors duration-300 group"
								whileHover={{ x: 4 }}
								transition={{ type: "spring", stiffness: 400, damping: 25 }}
							>
								<Image
									src={ICONS.instagramAccent}
									alt="Instagram"
									width={24}
									height={24}
									className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="text-base">@iovi.ink</span>
							</motion.a>

							{/* Studio Location */}
							<motion.a
								href={socialLinks.lewus.googleMaps}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 text-background/80 hover:text-secondary transition-colors duration-300 group"
								whileHover={{ x: 4 }}
								transition={{ type: "spring", stiffness: 400, damping: 25 }}
							>
								<Image
									src={ICONS.locationAccent}
									alt="Lokalizacja Studia"
									width={24}
									height={24}
									className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
								/>
								<span className="text-base">Studio Tatuażu - LewusInk</span>
							</motion.a>
						</div>
					</motion.div>
				</div>

				{/* Bottom Section */}
				<motion.div
					className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4"
					variants={itemVariants}
				>
					<div className="text-background/60 text-sm">
						© {new Date().getFullYear()} Copyright{" "}
						<motion.a
							href="/"
							className="text-primary hover:text-accent transition-colors duration-300"
							whileHover={{ scale: 1.02 }}
						>
							Iovi
						</motion.a>
					</div>

					<motion.a
						href="/polityka-prywatnosci"
						className="text-primary hover:text-accent transition-colors duration-300 text-sm"
						whileHover={{ scale: 1.02 }}
					>
						Polityka prywatności
					</motion.a>
				</motion.div>
			</div>
		</motion.footer>
	);
};

export default Footer;
