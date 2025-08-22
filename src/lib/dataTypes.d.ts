import { StringValidation } from "zod/v3";

export type Proces = {
	id: number;
	icon: any;
	bg_image: {
		mobile: string;
		desktop: string;
		alt: string;
	};
	title: string;
	description: string;
};
export type ProcessSectionProps = {
	subheadline: string;
	title: string;
	description: string;
	proces: Proces[];
};
export type AboutMeProps = {
	title: string;
	subheadline: string;
	description: string[];
	image: { src: string; alt: string };
};
export type ServicesProps = {
	servicesType: "main" | "featured";
	title: string;
	subheadline: string;
	description: string;
};
export type TargetAudienceDsc = {
	title: string;
	description: string;
};
export type TargetAudienceSectionProps = {
	title: string;
	targetAudienceDsc: TargetAudienceDsc[];
	image: {
		src: string;
		alt: string;
	};
};

export type WhyMeCard = {
	title: string;
	description: string;
	icon: string;
};
export type WhyMeProps = {
	title: string;
	cards: {
		left: WhyMeCard;
		centerTop: WhyMeCard;
		centerBottom: WhyMeCard;
		right: WhyMeCard;
	};
};

export type FaqQuestion = {
	id: number;
	question: string;
	answer: string;
};
export type FaqProps = {
	subheadline: string;
	questions: FaqQuestion[];
};

export type ContactProps = {
	subheadline: string;
	title: string;
	description: string;
};
