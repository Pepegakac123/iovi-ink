// src/components/PersonalShowcase/SkillTag.tsx
import * as motion from "motion/react-client";
import { itemVariants } from "@/lib/variants";
import { SkillTagProps, SkillTag as SkillTagType } from "@/lib/dataTypes";

// ===========================================
// SKILL TAG COLOR HELPER
// ===========================================

const getTagColor = (category: SkillTagType["category"]) => {
	switch (category) {
		case "style":
			return "bg-primary text-primary-foreground border-primary";
		case "technique":
			return "bg-accent text-accent-foreground border-accent";
		case "software":
			return "bg-secondary text-foreground border-foreground";
		default:
			return "bg-muted text-foreground border-foreground";
	}
};

// ===========================================
// SKILL TAG COMPONENT
// ===========================================

const SkillTag = ({ skill, index }: SkillTagProps) => (
	<motion.span
		className={`inline-block px-3 py-1 rounded-md border-2 text-sm font-primary ${getTagColor(skill.category)} transition-all duration-200 lg:hover:scale-105 lg:hover:shadow-[2px_2px_0px_0px_var(--foreground)] lg:hover:-translate-x-[1px] lg:hover:-translate-y-[1px]`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay: index * 0.05 }}
	>
		{skill.name}
	</motion.span>
);

export default SkillTag;
