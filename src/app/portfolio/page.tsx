// app/portfolio/page.tsx - Główna strona portfolio

import React from "react";
import SectionHero from "@/components/SectionHero";
import TattooGallery from "@/components/TattooGallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllTattooImages } from "@/lib/jetApi";
import * as motion from "motion/react-client";
import { containerVariants, itemVariants } from "@/lib/variants";
import Contact from "@/components/Sections/Contact";
import { NextSeo } from "next-seo";
import PORTFOLIO_SEO from "@/lib/config/seo/portfolio";

const PortfolioPage = async () => {
	const groupedImages = await getAllTattooImages();
	<NextSeo {...PORTFOLIO_SEO} />;
	return (
		<>
			{/* ✅ Mini Hero Section */}
			<SectionHero
				subTitle="Każdy projekt to unikalna historia"
				title="Moje Portfolio Tatuaży"
				description="Odkryj różnorodność stylów i technik - od delikatnych minimalistycznych kompozycji po precyzyjne wzory geometryczne. Każdy tatuaż to przemyślany projekt dostosowany do indywidualnych potrzeb i anatomii."
			/>

			{/* ✅ Main Portfolio Section */}
			<motion.section
				className="w-full bg-primary-foreground "
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
				variants={containerVariants}
			>
				<motion.div
					className="container flex flex-col gap-12 md:gap-16"
					variants={containerVariants}
				>
					{/* ✅ Tabs z Galerią */}
					<motion.div variants={itemVariants}>
						<Tabs defaultValue="wszystkie" className="w-full">
							{/* ✅ Tabs Navigation - poprawione values */}
							<div className="flex justify-center md:justify-center mb-6 md:mb-8">
								<TabsList className="w-full md:w-auto">
									<TabsTrigger value="wszystkie">
										<span className="block md:inline">Wszystkie</span>
										<span className="block md:inline">
											({groupedImages.allImages.length})
										</span>
									</TabsTrigger>
									<TabsTrigger value="damskie">
										<span className="block md:inline">Damskie</span>
										<span className="block md:inline">
											({groupedImages.damskie.length})
										</span>
									</TabsTrigger>
									<TabsTrigger value="kwiatowe">
										<span className="block md:inline">kwiatowe</span>
										<span className="block md:inline">
											({groupedImages.kwiatowe.length})
										</span>
									</TabsTrigger>
									<TabsTrigger value="minimalistyczne">
										<span className="block md:inline">Minimalistyczne</span>
										<span className="block md:inline">
											({groupedImages.minimalistyczne.length})
										</span>
									</TabsTrigger>

									<TabsTrigger value="graficzne">
										<span className="block md:inline">Graficzne</span>
										<span className="block md:inline">
											({groupedImages.graficzne.length})
										</span>
									</TabsTrigger>
								</TabsList>
							</div>

							{/* ✅ Tabs Content - wszystkie kategorie */}
							<TabsContent
								value="wszystkie"
								className="border-0 bg-transparent p-0 shadow-none"
							>
								<TattooGallery
									images={groupedImages.allImages}
									className="animate-in fade-in-50 duration-500"
								/>
							</TabsContent>

							<TabsContent
								value="damskie"
								className="border-0 bg-transparent p-0 shadow-none"
							>
								<TattooGallery
									images={groupedImages.damskie}
									className="animate-in fade-in-50 duration-500"
								/>
							</TabsContent>

							<TabsContent
								value="minimalistyczne"
								className="border-0 bg-transparent p-0 shadow-none"
							>
								<TattooGallery
									images={groupedImages.minimalistyczne}
									className="animate-in fade-in-50 duration-500"
								/>
							</TabsContent>

							<TabsContent
								value="kwiatowe"
								className="border-0 bg-transparent p-0 shadow-none"
							>
								<TattooGallery
									images={groupedImages.kwiatowe}
									className="animate-in fade-in-50 duration-500"
								/>
							</TabsContent>

							<TabsContent
								value="graficzne"
								className="border-0 bg-transparent p-0 shadow-none"
							>
								<TattooGallery
									images={groupedImages.graficzne}
									className="animate-in fade-in-50 duration-500"
								/>
							</TabsContent>
						</Tabs>
					</motion.div>
					{/* ✅ Portfolio Stats */}
					<motion.div
						className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
						variants={containerVariants}
					>
						<motion.div
							className="bg-background rounded-md border-2 border-foreground p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_var(--foreground)]"
							variants={itemVariants}
							whileHover={{
								scale: 1.02,
								y: -2,
								transition: { duration: 0.3 },
							}}
						>
							<h3 className="text-lg md:text-xl lg:text-2xl font-primary text-foreground mb-1 md:mb-2">
								{groupedImages.allImages.length}+
							</h3>
							<p className="text-xs md:text-sm text-muted-foreground">
								Wszystkich projektów
							</p>
						</motion.div>

						<motion.div
							className="bg-background rounded-md border-2 border-foreground p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_var(--foreground)]"
							variants={itemVariants}
							whileHover={{
								scale: 1.02,
								y: -2,
								transition: { duration: 0.3 },
							}}
						>
							<h3 className="text-lg md:text-xl lg:text-2xl font-primary text-foreground mb-1 md:mb-2">
								{groupedImages.damskie.length}
							</h3>
							<p className="text-xs md:text-sm text-muted-foreground">
								Damskich wzorów
							</p>
						</motion.div>

						<motion.div
							className="bg-background rounded-md border-2 border-foreground p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_var(--foreground)]"
							variants={itemVariants}
							whileHover={{
								scale: 1.02,
								y: -2,
								transition: { duration: 0.3 },
							}}
						>
							<h3 className="text-lg md:text-xl lg:text-2xl font-primary text-foreground mb-1 md:mb-2">
								{groupedImages.kwiatowe.length}
							</h3>
							<p className="text-xs md:text-sm text-muted-foreground">
								Florystycznych
							</p>
						</motion.div>

						<motion.div
							className="bg-background rounded-md border-2 border-foreground p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_var(--foreground)]"
							variants={itemVariants}
							whileHover={{
								scale: 1.02,
								y: -2,
								transition: { duration: 0.3 },
							}}
						>
							<h3 className="text-lg md:text-xl lg:text-2xl font-primary text-foreground mb-1 md:mb-2">
								{groupedImages.graficzne.length}
							</h3>
							<p className="text-xs md:text-sm text-muted-foreground">
								Graficznych
							</p>
						</motion.div>
					</motion.div>
				</motion.div>
			</motion.section>
			<section>
				<Contact />
			</section>
		</>
	);
};

export default PortfolioPage;
