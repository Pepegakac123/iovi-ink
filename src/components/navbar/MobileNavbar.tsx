"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import NavPrimaryBtn from "../buttons/NavPrimaryBtn";
import { containerVariants, navItemVariants } from "@/lib/variants";
import { menuItems, services, MenuItem, ServiceItem } from "@/lib/menuData";
import { images } from "@/lib/images";

const MobileNavbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Body + documentElement scroll lock (safer across browsers)
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
			document.documentElement.style.overflow = "hidden"; // lock html as well
		} else {
			document.body.style.overflow = "";
			document.documentElement.style.overflow = "";
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = "";
			document.documentElement.style.overflow = "";
		};
	}, [isMenuOpen]);

	return (
		<>
			{/* Mobile Navbar - Fixed with bottom margin */}
			<motion.nav
				className="lg:hidden fixed bottom-10 left-4 right-4 z-40"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="px-4">
					<div className="flex items-center justify-between h-16">
						{/* Mobile Menu Button */}
						<motion.button
							className="p-3 rounded bg-muted border-2 border-foreground shadow-[0_4px_0px_0px_theme(colors.foreground)] hover:shadow-[0_6px_0px_0px_theme(colors.foreground)] hover:translate-y-[-2px] transition-all duration-200"
							variants={navItemVariants}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							type="button"
						>
							<AnimatePresence mode="wait">
								{isMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<X className="w-6 h-6" />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<HiOutlineMenuAlt2 className="w-6 h-6" />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.button>

						{/* Logo */}
						<motion.a
							href="/"
							className="flex items-center group"
							variants={navItemVariants}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Image
								src={images.logo.src}
								alt={images.logo.alt}
								width={80}
								height={68}
								className="w-[80px] h-[68px] object-contain"
							/>
						</motion.a>
					</div>

					{/* Mobile Menu - Full Height with Scroll Lock */}
					<AnimatePresence>
						{isMenuOpen && (
							<motion.div
								className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg lg:hidden min-h-screen h-[100dvh] overflow-hidden"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								{/* Close button - repositioned */}
								<motion.button
									className="absolute top-4 right-4 p-2 rounded-full border-2 border-foreground hover:bg-accent transition-colors"
									onClick={() => setIsMenuOpen(false)}
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
									type="button"
								>
									<X className="w-5 h-5" />
								</motion.button>

								{/* Menu content - Scrollable with proper constraints */}
								<div className="flex h-full w-full items-center justify-center px-4">
									<motion.div
										className="text-center w-full max-w-xs max-h-[100dvh] overflow-y-auto py-8"
										initial={{ y: 30, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.1, duration: 0.4 }}
									>
										{/* Main menu items - Reduced spacing */}
										<div className="flex flex-col gap-6 mb-4">
											{menuItems.map((item: MenuItem, index: number) => (
												<motion.a
													key={item.name}
													href={item.href}
													className="block text-xl font-primary text-foreground hover:text-primary transition-colors py-1"
													initial={{ x: -30, opacity: 0 }}
													animate={{ x: 0, opacity: 1 }}
													transition={{
														delay: 0.2 + index * 0.1,
														duration: 0.3,
													}}
													onClick={() => setIsMenuOpen(false)}
												>
													{item.name}
												</motion.a>
											))}
										</div>

										{/* Services section - Simplified */}
										<motion.div
											className="py-4 border-t border-foreground/20 font-primary flex flex-col gap-2"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.6, duration: 0.3 }}
										>
											<span className="text-lg font-primary text-foreground mb-4">
												Usługi
											</span>
											{/* Only show first 3 services to save space */}
											<div className="space-y-2">
												{services.tatuaze.items
													.slice(0, 3)
													.map((item: ServiceItem, index: number) => (
														<motion.a
															key={item.name}
															href={item.href}
															className="flex items-center gap-2 text-sm font-medium font-text text-foreground hover:text-primary transition-colors py-1"
															initial={{ x: -20, opacity: 0 }}
															animate={{ x: 0, opacity: 1 }}
															transition={{
																delay: 0.7 + index * 0.1,
																duration: 0.3,
															}}
															onClick={() => setIsMenuOpen(false)}
														>
															<span className="text-accent">
																<item.icon className="w-3 h-3" />
															</span>
															{item.name}
														</motion.a>
													))}
												{/* Show more link */}
												<motion.a
													href="/uslugi"
													className="block text-sm text-primary hover:text-accent transition-colors mt-2 font-medium"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1, duration: 0.3 }}
													onClick={() => setIsMenuOpen(false)}
												>
													Zobacz wszystkie usługi →
												</motion.a>
											</div>
										</motion.div>

										{/* CTA Button - Smaller */}
										<motion.div
											className="pt-4"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.9, duration: 0.3 }}
										>
											<NavPrimaryBtn />
										</motion.div>
									</motion.div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.nav>
		</>
	);
};

export default MobileNavbar;
