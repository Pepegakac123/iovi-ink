"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import NavPrimaryBtn from "../buttons/NavPrimaryBtn";
import ServiceDropdown from "./ServiceDropdown";
import { containerVariants, navItemVariants } from "@/lib/variants";
import { menuItems, services, type MenuItem } from "@/lib/menuData";

const DesktopNavbar: React.FC = () => {
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	return (
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
					<div className="flex items-center gap-4">
						{menuItems.map((item: MenuItem, index: number) => (
							<motion.a
								key={item.name}
								href={item.href}
								className="text-foreground hover:text-primary transition-colors font-secondary font-bold relative group px-3 py-2 rounded hover:bg-accent/20 hover:shadow-[2px_2px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] border-2 border-transparent hover:border-foreground transition-all duration-200"
								variants={navItemVariants}
							>
								{item.name}
							</motion.a>
						))}

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
	);
};

export default DesktopNavbar;
