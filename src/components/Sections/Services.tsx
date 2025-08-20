import { getFeaturedServicesWithAltText } from "@/lib/jetApi";
import SecondaryBtn from "../buttons/SecondaryBtn";
import Subheadline from "../Subheadline";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import ServicesCard from "../ServicesCard";
import { containerVariants, itemVariants } from "@/lib/variants";

const Services = async () => {
	const services = await getFeaturedServicesWithAltText();

	return (
		<motion.div
			className="container flex flex-col gap-4 md:gap-8 justify-center items-center"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={containerVariants}
		>
			<motion.div variants={itemVariants}>
				<Subheadline title="Nie powtarzam schematów" />
			</motion.div>

			<motion.h2
				className="text-2xl md:text-4xl text-background font-primary text-center"
				variants={itemVariants}
				whileHover={{
					scale: 1.02,
					transition: { duration: 0.2 },
				}}
			>
				Co mogę ci zaoferować?
			</motion.h2>

			<motion.p
				className="text-base text-background max-w-[525px] text-center"
				variants={itemVariants}
			>
				Nie ma szablonów. Każdy projekt to unikalna realizacja dostosowana do
				Twoich potrzeb i mojej wizji artystycznej.
			</motion.p>

			{/* Cards container */}
			<motion.div
				className="flex flex-wrap gap-4 sm:gap-6 w-full justify-center"
				variants={containerVariants}
			>
				{services.map((service, index) => (
					<ServicesCard service={service} key={service.id} />
				))}
			</motion.div>

			<motion.div
				variants={itemVariants}
				whileInView="visible"
				viewport={{ once: true }}
			>
				<div className="mt-8">
					<SecondaryBtn
						text="Zobacz wszystkie rodzaje tatuaży"
						link="/uslugi"
					/>
				</div>
			</motion.div>
		</motion.div>
	);
};
export default Services;
