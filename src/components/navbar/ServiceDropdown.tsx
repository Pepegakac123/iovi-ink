"use client";

import React from "react";
import * as motion from "motion/react-client";
import { ChevronDown } from "lucide-react";
import { dropdownVariants } from "@/lib/variants";
import type {
	Service,
	ServiceItem,
	ServiceDropdownProps,
} from "@/lib/menuData";

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
					<service.icon className="w-4 h-4" />
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
								<item.icon className="w-4 h-4" />
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

export default ServiceDropdown;
