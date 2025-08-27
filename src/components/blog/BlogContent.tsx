// src/components/blog/BlogContent.tsx

import * as motion from "motion/react-client";
import { containerVariants, itemVariants } from "@/lib/variants";

interface BlogContentProps {
	content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
	return (
		<motion.div
			className="bg-primary-foreground border-2 border-foreground rounded-md p-6 md:p-8 lg:p-12"
			variants={itemVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			whileHover={{
				boxShadow: "4px 4px 0px 0px var(--foreground)",
				transition: { duration: 0.2 },
			}}
		>
			{/* Blog HTML Content */}
			<div
				className="blog-content"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</motion.div>
	);
};

export default BlogContent;
