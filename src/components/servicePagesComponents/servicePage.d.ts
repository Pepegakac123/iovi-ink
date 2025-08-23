// src/components/servicePageComponents/servicePage.ts

// ================================================================
// SHARED TYPES FOR SERVICE PAGE COMPONENTS
// ================================================================

// Base content section from API
export type ServiceContentSection = {
	h3: string;
	content: string;
};

// Image with alt text
export type ServiceImage = {
	src: string;
	alt: string;
};

// ================================================================
// TARGET AUDIENCE SECTION
// ================================================================

export type ServiceTargetAudienceDsc = {
	h3: string;
	content: string;
};

export type ServiceTargetAudienceSectionProps = {
	title: string;
	subtitle: string;
	targetAudienceDsc: ServiceTargetAudienceDsc[];
	image: ServiceImage;
};

// ================================================================
// SERVICE ROLE SECTION
// ================================================================

export type ServiceRoleItem = {
	h3: string;
	content: string;
};

export type ServiceRoleSectionProps = {
	title: string;
	subtitle: string;
	roleItems: ServiceRoleItem[];
	images: ServiceImage[];
};

// ================================================================
// BENEFITS SECTION
// ================================================================

export type ServiceBenefitItem = {
	h3: string;
	description: string;
	ikona: string;
};

export type ServiceBenefitsSectionProps = {
	title: string;
	subtitle: string;
	benefits: ServiceBenefitItem[];
	image: ServiceImage;
};

// ================================================================
// PROCESS SECTION
// ================================================================

export type ServiceProcessStep = {
	number: string;
	title: string;
	description: string;
};

export type ServiceProcessSectionProps = {
	title: string;
	subtitle: string;
	processSteps: ServiceProcessStep[];
	image: ServiceImage;
};

// ================================================================
// WHY ME SECTION
// ================================================================

export type ServiceWhyMeItem = {
	h3: string;
	content: string;
};

export type ServiceWhyMeSectionProps = {
	title: string;
	subtitle: string;
	whyMeItems: ServiceWhyMeItem[];
	image: ServiceImage;
};

// ================================================================
// CTA SECTION
// ================================================================

export type ServiceCtaItem = {
	h3: string;
	content: string;
};

export type ServiceCtaSectionProps = {
	title: string;
	subtitle: string;
	ctaItems: ServiceCtaItem[];
};

// ================================================================
// WHY ME DISTINGUISHING SECTION
// ================================================================

export type ServiceDistinguishingItem = {
	h3: string;
	content: string;
};

export type ServiceDistinguishingSectionProps = {
	title: string;
	subtitle: string;
	distinguishingItems: ServiceDistinguishingItem[];
};
