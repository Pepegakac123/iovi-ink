// src/app/uslugi/page.tsx
import * as motion from "motion/react-client";
import SectionHero from "@/components/SectionHero";
import ServicesCard from "@/components/ServicesCard";
import Contact from "@/components/Sections/Contact";
import { getServicesWithAltText } from "@/lib/jetApi";
import { containerVariants, itemVariants } from "@/lib/variants";
import { contactHome, procesHome } from "@/lib/data";

// ===========================================
// MAIN SERVICES PAGE COMPONENT
// ===========================================

const ServicesPage = async () => {
	const services = await getServicesWithAltText("main");

	return (
		<>
			{/* ✅ Mini Hero Section */}
			<SectionHero
				subTitle="Profesjonalne usługi tatuażu"
				title="Moje Usługi"
				description="Specjalizuję się w minimalistycznych / subtelnych i graficznych tatuażach oraz indywidualnych projektach. Każdy tatuaż to przemyślana realizacja dostosowana do anatomii i Twoich potrzeb."
			/>

			{/* ✅ Main Services Section */}
			<motion.main
				className="w-full bg-primary-foreground py-16 md:py-20"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
				variants={containerVariants}
			>
				<motion.div className="container" variants={containerVariants}>
					{/* Services Grid - 4 kolumny na dużych ekranach + stretch items */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch"
						variants={containerVariants}
					>
						{services.map((service) => (
							<motion.div
								key={service.id}
								variants={itemVariants}
								whileHover={{
									y: -4,
									transition: { duration: 0.2, ease: "easeOut" },
								}}
							>
								<ServicesCard service={service} />
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</motion.main>

			{/* ✅ Process Section */}
			<section>
				<Contact {...contactHome} />
			</section>
		</>
	);
};

export default ServicesPage;
