// src/components/blog/BlogSidebar.tsx

import * as motion from "motion/react-client";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { services } from "@/lib/menuData";
import { containerVariants, itemVariants } from "@/lib/variants";

interface BlogSidebarProps {
	title: string;
	date: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ title, date }) => {
	return (
		<motion.div
			className="space-y-8"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
		>
			{/* ✅ Blog Info Card */}
			<motion.div
				className="bg-primary-foreground border-2 border-foreground rounded-md p-6 md:p-8"
				variants={itemVariants}
				whileHover={{
					boxShadow: "4px 4px 0px 0px var(--foreground)",
					transition: { duration: 0.2 },
				}}
			>
				{/* Date */}
				<motion.div
					className="flex items-center gap-2 mb-4 text-muted-foreground"
					variants={itemVariants}
				>
					<Calendar className="w-4 h-4" />
					<span className="text-sm font-text">{date}</span>
				</motion.div>

				{/* Title */}
				<motion.h1
					className="heading-secondary leading-tight"
					variants={itemVariants}
					whileHover={{
						scale: 1.02,
						transition: { duration: 0.2 },
					}}
				>
					{title}
				</motion.h1>
			</motion.div>

			{/* ✅ Services Navigation */}
			<motion.div
				className="bg-background border-2 border-accent rounded-md p-6 md:p-8"
				variants={itemVariants}
				whileHover={{
					boxShadow: "4px 4px 0px 0px var(--accent)",
					transition: { duration: 0.2 },
				}}
			>
				<motion.h3
					className="heading-small mb-6 text-center"
					variants={itemVariants}
				>
					Moje Usługi
				</motion.h3>

				<motion.div className="space-y-4" variants={containerVariants}>
					{Object.values(services).map((category) => (
						<motion.div key={category.title} variants={itemVariants}>
							{/* Category Title */}
							<motion.div
								className="flex items-center gap-2 mb-3 text-primary"
								whileHover={{ x: 2 }}
								transition={{ duration: 0.2 }}
							>
								<category.icon className="w-4 h-4" />
								<span className="text-sm font-primary uppercase font-semibold">
									{category.title}
								</span>
							</motion.div>

							{/* Service Items */}
							<motion.ul
								className="space-y-2 ml-6"
								variants={containerVariants}
							>
								{category.items.map((item) => (
									<motion.li key={item.href} variants={itemVariants}>
										<Link href={item.href} className="block group">
											<motion.div
												className="flex items-start gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200 py-1"
												whileHover={{ x: 2 }}
												transition={{ duration: 0.2 }}
											>
												<item.icon className="w-3 h-3 mt-0.5 flex-shrink-0 group-hover:text-primary" />
												<span className="font-text leading-tight">
													{item.name}
												</span>
											</motion.div>
										</Link>
									</motion.li>
								))}
							</motion.ul>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Link */}
				<motion.div
					className="mt-8 pt-6 border-t border-muted"
					variants={itemVariants}
				>
					<Link href="/uslugi" className="block w-full text-center">
						<motion.div
							className="bg-secondary text-foreground font-primary text-sm px-4 py-3 uppercase border-1 border-foreground rounded-md hover:bg-muted transition-colors duration-200"
							whileHover={{
								scale: 1.02,
								boxShadow: "3px 3px 0px 0px var(--foreground)",
								translateX: -1,
								translateY: -1,
							}}
							whileTap={{ scale: 0.98 }}
						>
							Zobacz wszystkie usługi
						</motion.div>
					</Link>
				</motion.div>
			</motion.div>

			{/* ✅ Contact CTA */}
			<motion.div
				className="bg-primary text-primary-foreground border-2 border-foreground rounded-md p-6 md:p-8 text-center"
				variants={itemVariants}
				whileHover={{
					boxShadow: "4px 4px 0px 0px var(--foreground)",
					transition: { duration: 0.2 },
				}}
			>
				<motion.h4
					className="heading-small text-primary-foreground mb-3"
					variants={itemVariants}
				>
					Masz pytania?
				</motion.h4>

				<motion.p
					className="paragraph-small text-primary-foreground/90 mb-4"
					variants={itemVariants}
				>
					Skontaktuj się ze mną, aby omówić swój projekt tatuażu.
				</motion.p>

				<Link href="/kontakt">
					<motion.div
						className="bg-background text-foreground font-primary text-sm px-4 py-3 uppercase rounded-md hover:bg-accent transition-colors duration-200 inline-block"
						whileHover={{
							scale: 1.02,
							boxShadow: "3px 3px 0px 0px var(--background)",
						}}
						whileTap={{ scale: 0.98 }}
					>
						Napisz do mnie
					</motion.div>
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default BlogSidebar;
