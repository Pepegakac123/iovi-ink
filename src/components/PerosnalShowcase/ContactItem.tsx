// src/components/PersonalShowcase/ContactItem.tsx
import Image from "next/image";
import * as motion from "motion/react-client";
import { cardVariants } from "@/lib/variants";
import { ContactItemProps } from "@/lib/dataTypes";

// ===========================================
// CONTACT ITEM COMPONENT
// ===========================================

const ContactItem = ({ contact, index }: ContactItemProps) => {
	const content = (
		<motion.div
			className="flex items-center gap-3 p-3 bg-background border-2 border-foreground rounded-md hover:bg-muted transition-all duration-200 lg:hover:scale-[1.02] lg:hover:shadow-[3px_3px_0px_0px_var(--accent)] lg:hover:-translate-x-[1px] lg:hover:-translate-y-[1px]"
			variants={cardVariants}
			custom={index}
		>
			<Image
				src={contact.icon}
				alt={`${contact.type} icon`}
				width={20}
				height={20}
				className="w-5 h-5 flex-shrink-0"
			/>
			<span className="text-sm font-primary text-foreground truncate">
				{contact.value}
			</span>
		</motion.div>
	);

	if (contact.href) {
		return (
			<a
				href={contact.href}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
			>
				{content}
			</a>
		);
	}

	return content;
};

export default ContactItem;
