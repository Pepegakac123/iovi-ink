"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import NavPrimaryBtn from "../buttons/NavPrimaryBtn";
import { containerVariants, navItemVariants } from "@/lib/variants";
import { menuItems, services, MenuItem, ServiceItem } from "@/lib/menuData";

const MobileNavbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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
								src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/iovi-high-resolution-logo-transparent.png"
								alt="iovi-ink logo"
								width={80}
								height={68}
								className="w-[80px] h-[68px] object-contain"
							/>
						</motion.a>
					</div>

					{/* Mobile Menu */}
					<AnimatePresence>
						{isMenuOpen && (
							<motion.div
								className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg lg:hidden"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								{/* Close button */}
								<motion.button
									className="absolute top-6 right-6 p-3 rounded-full border-2 border-foreground hover:bg-accent transition-colors"
									onClick={() => setIsMenuOpen(false)}
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
								>
									<X className="w-6 h-6" />
								</motion.button>

								{/* Menu content */}
								<div className="flex flex-col items-center justify-center min-h-screen px-6">
									<motion.div
										className="text-center space-y-8 w-full max-w-sm"
										initial={{ y: 30, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.1, duration: 0.4 }}
									>
										{/* Main menu items */}
										<div className="space-y-6">
											{menuItems.map((item: MenuItem, index: number) => (
												<motion.a
													key={item.name}
													href={item.href}
													className="block text-2xl font-bold text-foreground hover:text-primary transition-colors py-2"
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

										{/* Services section */}
										<motion.div
											className="pt-8 border-t border-foreground/20"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.6, duration: 0.3 }}
										>
											<p className="text-2xl font-bold text-foreground mb-4 tracking-wider">
												Usługi
											</p>
											<div className="space-y-4">
												{services.tatuaze.items.map(
													(item: ServiceItem, index: number) => (
														<motion.a
															key={item.name}
															href={item.href}
															className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors py-1"
															initial={{ x: -20, opacity: 0 }}
															animate={{ x: 0, opacity: 1 }}
															transition={{
																delay: 0.7 + index * 0.1,
																duration: 0.3,
															}}
															onClick={() => setIsMenuOpen(false)}
														>
															<span className="text-accent">
																<item.icon className="w-4 h-4" />
															</span>
															{item.name}
														</motion.a>
													),
												)}
											</div>
										</motion.div>

										{/* CTA Button */}
										<motion.div
											className="pt-8"
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

			{/* Mobile content padding to prevent overlap with fixed navbar */}
			<div className="lg:hidden h-16" />
		</>
	);
};

export default MobileNavbar;
