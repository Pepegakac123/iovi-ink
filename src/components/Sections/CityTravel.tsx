import Subheadline from "@/components/Subheadline";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import { socialLinks } from "@/lib/data";
import type { CityHub } from "@/lib/cityHubs";

const STUDIO_ADDRESS = "Lewus Ink, Piłsudskiego 8, 34-730 Mszana Dolna";

const directionsUrl = (origin: string) =>
	`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(STUDIO_ADDRESS)}`;

// Sekcja dojazdu na stronie huba lokalnego: zastępuje osobne strony małych miejscowości
// (te przekierowują tutaj) i daje konkretny następny krok — trasa albo konsultacja.
const CityTravel = ({ hub }: { hub: CityHub }) => {
	const towns = [{ slug: "", name: hub.name }, ...hub.nearby];

	return (
		<section className="bg-primary-foreground py-16 md:py-20">
			<div className="container px-4 md:px-8 flex flex-col items-center gap-6 text-center">
				<Subheadline title="Dojazd do studia" />
				<h2 className="heading-primary max-w-[800px]">
					{hub.name === "Mszana Dolna"
						? "Jak dojechać do studia w Mszanie Dolnej"
						: `Tatuaż w Mszanie Dolnej — dojazd z ${hub.fromName}${hub.nearby.length > 0 ? " i okolic" : ""}`}
				</h2>
				<p className="paragraph-center-constrained">
					Tatuuję w Studio Lewus Ink przy ul. Piłsudskiego 8 w Mszanie Dolnej.
					Konsultacja jest bezpłatna — możesz ją zrobić online, a do studia
					przyjeżdżasz tylko na sesję.
				</p>
				<ul className="flex flex-wrap justify-center gap-3 max-w-[900px]">
					{towns.map((town) => (
						<li key={town.name}>
							<a
								href={directionsUrl(town.name)}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block border-1 border-foreground rounded-md px-4 py-2 font-text text-sm bg-background hover:bg-secondary transition-colors"
							>
								Trasa z: {town.name}
							</a>
						</li>
					))}
				</ul>
				<div className="flex flex-col md:flex-row gap-4 items-center">
					<PrimaryBtn />
					<a
						href={socialLinks.iovi.instagram}
						target="_blank"
						rel="noopener noreferrer"
						className="font-primary uppercase text-base underline underline-offset-4 hover:text-primary"
					>
						Napisz na Instagramie
					</a>
				</div>
			</div>
		</section>
	);
};

export default CityTravel;
