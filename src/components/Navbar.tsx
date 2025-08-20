"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { AnimatePresence, Variants } from "motion/react";
import {
	ChevronDown,
	Menu,
	X,
	Palette,
	Layers3,
	Zap,
	Sparkles,
} from "lucide-react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import NavPrimaryBtn from "./buttons/NavPrimaryBtn";
import {
	containerVariants,
	dropdownVariants,
	navItemVariants,
} from "@/lib/variants";

// Types
interface ServiceItem {
	name: string;
	desc: string;
	icon: React.ReactNode;
	href: string;
}

interface Service {
	title: string;
	icon: React.ReactNode;
	items: ServiceItem[];
}

interface ServiceDropdownProps {
	serviceKey: string;
	service: Service;
}

// ServiceDropdown component moved outside for performance
const ServiceDropdown: React.FC<ServiceDropdownProps> = ({
	serviceKey,
	service,
}) => {
	return (
		<motion.div
			className="absolute bottom-full left-0 mb-2 lg:top-full lg:bottom-auto lg:mt-2 lg:mb-0 w-80 bg-background border-4 border-foreground rounded-md shadow-[8px_8px_0px_0px_theme(colors.foreground)] z-50"
			variants={dropdownVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			<div className="p-6">
				<div className="flex items-center gap-2 mb-4 text-primary">
					{service.icon}
					<h3 className="font-bold text-lg">{service.title}</h3>
				</div>
				<div className="grid gap-3">
					{service.items.map((item: ServiceItem, index: number) => (
						<motion.a
							key={item.name}
							href={item.href}
							className="group flex items-start gap-3 p-3 rounded border-2 border-transparent hover:border-foreground hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<div className="text-accent mt-1 transition-colors">
								{item.icon}
							</div>
							<div>
								<div className="font-bold text-foreground transition-colors">
									{item.name}
								</div>
								<div className="text-sm text-muted-foreground mt-1">
									{item.desc}
								</div>
							</div>
						</motion.a>
					))}
				</div>
				<motion.div
					className="mt-4 pt-4 border-t-2 border-foreground"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<a
						href="/uslugi"
						className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors font-bold"
					>
						Zobacz wszystkie usługi
						<ChevronDown className="w-3 h-3 rotate-[-90deg]" />
					</a>
				</motion.div>
			</div>
		</motion.div>
	);
};

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	const services = {
		tatuaze: {
			title: "Tatuaże",
			icon: <Zap className="w-4 h-4" />,
			items: [
				{
					name: "Minimalistyczne",
					desc: "Delikatne, subtelne projekty",
					icon: <Sparkles className="w-4 h-4" />,
					href: "/uslugi/tatuaze/minimalistyczne",
				},
				{
					name: "Geometryczne",
					desc: "Precyzyjne wzory i kształty",
					icon: <Layers3 className="w-4 h-4" />,
					href: "/uslugi/tatuaze/geometryczne",
				},
				{
					name: "Fine Line",
					desc: "Cienkie linie, szczegółowe",
					icon: <Palette className="w-4 h-4" />,
					href: "/uslugi/tatuaze/fine-line",
				},
			],
		},
	};

	const menuItems = [
		{ name: "Strona główna", href: "/" },
		{ name: "Portfolio", href: "/portfolio" },
		{ name: "O Mnie", href: "/o-mnie" },
		{ name: "Kontakt", href: "/kontakt" },
	];

	return (
		<>
			{/* Desktop Navbar - Sticky Top */}
			<motion.nav
				className="hidden py-2 lg:block sticky top-0 z-40 w-full bg-background backdrop-blur-sm border-b-2 border-foreground shadow-[0_4px_0px_0px_theme(colors.foreground)]"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-20">
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
								width={120}
								height={102}
								className="object-cover"
							/>
						</motion.a>

						{/* Desktop Menu */}
						<div className="flex items-center gap-4 ">
							{menuItems.map(
								(item: { name: string; href: string }, index: number) => (
									<motion.a
										key={item.name}
										href={item.href}
										className="text-foreground hover:text-primary transition-colors font-secondary font-bold relative group px-3 py-2 rounded hover:bg-accent/20 hover:shadow-[2px_2px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] border-2 border-transparent hover:border-foreground transition-all duration-200"
										variants={navItemVariants}
									>
										{item.name}
									</motion.a>
								),
							)}

							{/* Services Dropdown */}
							<div className="relative">
								<motion.button
									className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-secondary font-bold group px-3 py-2 rounded hover:bg-accent/20 hover:shadow-[2px_2px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] border-2 border-transparent hover:border-foreground transition-all duration-200"
									variants={navItemVariants}
									onMouseEnter={() => setActiveDropdown("services")}
									onMouseLeave={() => setActiveDropdown(null)}
								>
									Usługi
									<motion.div
										animate={{
											rotate: activeDropdown === "services" ? 180 : 0,
										}}
										transition={{ duration: 0.2 }}
									>
										<ChevronDown className="w-4 h-4" />
									</motion.div>
								</motion.button>

								<AnimatePresence>
									{activeDropdown === "services" && (
										<motion.div
											className="absolute top-full left-0 mt-2"
											onMouseEnter={() => setActiveDropdown("services")}
											onMouseLeave={() => setActiveDropdown(null)}
										>
											<ServiceDropdown
												serviceKey="tatuaze"
												service={services.tatuaze}
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* CTA Button */}
							<NavPrimaryBtn />
						</div>
					</div>
				</div>
			</motion.nav>

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
											{menuItems.map(
												(
													item: { name: string; href: string },
													index: number,
												) => (
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
												),
											)}
										</div>

										{/* Services section */}
										<motion.div
											className="pt-8 border-t border-foreground/20"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.6, duration: 0.3 }}
										>
											<p className="text-2xl font-bold text-foreground mb-4  tracking-wider">
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
															<span className="text-accent">{item.icon}</span>
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

export default Navbar;
