// src/components/blog/BlogContent.tsx

import Image from "next/image";
import { getImageWithAltText } from "@/lib/jetApi";

interface BlogContentProps {
	image: string;
	content: string;
}

const BlogContent: React.FC<BlogContentProps> = async ({ content, image }) => {
	const imageWithAlt = await getImageWithAltText(image);
	// Treść artykułu jest nad linią zgięcia — renderujemy ją bez animacji wejścia,
	// żeby obraz LCP i tekst nie czekały na hydratację (opacity: 0 w SSR).
	return (
		<div className="bg-primary-foreground border-2 border-foreground rounded-md p-6 md:p-8 lg:p-12 transition-shadow duration-200 hover:shadow-[4px_4px_0px_0px_var(--foreground)]">
			<div
				className="relative w-full rounded-md overflow-hidden group max-h-[500px]"
				style={{ aspectRatio: "3/4", maxHeight: "400px" }}
			>
				<Image
					src={imageWithAlt.src}
					alt={imageWithAlt.alt}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					sizes="(max-width: 1024px) 100vw, 828px"
					priority
					quality={75}
				/>
			</div>
			{/* Blog HTML Content */}
			<div
				className="blog-content"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</div>
	);
};

export default BlogContent;
