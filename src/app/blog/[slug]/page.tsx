// src/app/blog/[slug]/page.tsx

import { BreadcrumbJsonLd } from "next-seo";
import { getAllBlogs, getBlogBySlug } from "@/lib/jetApi";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Contact from "@/components/Sections/Contact";
import { contactHome } from "@/lib/data";
import * as motion from "motion/react-client";
import { containerVariants, itemVariants } from "@/lib/variants";
import BlogContent from "@/components/blog/BlogContent";
import BlogFAQSection from "@/components/blog/BlogFAQSection";

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	try {
		const { slug } = await params;
		const blog = await getBlogBySlug(slug);

		return {
			title: blog.title,
			description: blog.excerpt,
			keywords: [
				"porady o tatuażach",
				"pielęgnacja tatuaży",
				"inspiracje tatuażowe",
				"blog tatuażowy",
			],
			openGraph: {
				title: blog.title,
				description: blog.excerpt,
				url: `https://iovi-ink.pl/blog/${slug}`,
				type: "article",
			},
			alternates: {
				canonical: `https://iovi-ink.pl/blog/${slug}`,
			},
		};
	} catch (error) {
		return {
			title: "Blog nie znaleziony",
			description: "Szukany artykuł nie istnieje.",
		};
	}
}

export async function generateStaticParams() {
	const blogs = await getAllBlogs();
	return blogs.map((blog) => ({ slug: blog.slug }));
}

async function BlogSinglePage({ params }: { params: { slug: string } }) {
	const { slug } = await params;
	const blog = await getBlogBySlug(slug);

	// Format date to Polish format
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("pl-PL", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return dateString;
		}
	};

	return (
		<>
			<BreadcrumbJsonLd
				useAppDir={true}
				itemListElements={[
					{
						position: 1,
						name: "Strona główna",
						item: "https://iovi-ink.pl",
					},
					{
						position: 2,
						name: "Blog",
						item: "https://iovi-ink.pl/blog",
					},
					{
						position: 3,
						name: blog.title,
						item: `https://iovi-ink.pl/blog/${slug}`,
					},
				]}
			/>

			{/* ✅ Main Blog Layout */}
			<motion.main
				className="w-full py-16 md:py-20"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
				variants={containerVariants}
			>
				<div className="container">
					<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
						{/* ✅ Left Sidebar - Sticky */}
						<motion.aside
							className="w-full lg:w-1/3 lg:sticky lg:top-[120px] lg:self-start order-1"
							variants={itemVariants}
						>
							<BlogSidebar title={blog.title} date={formatDate(blog.date)} />
						</motion.aside>

						{/* ✅ Right Content */}
						<motion.article
							className="w-full lg:w-2/3 order-2 space-y-8 md:space-y-12"
							variants={itemVariants}
						>
							{/* Main Blog Content */}
							<BlogContent content={blog.content} />

							{/* FAQ Section */}
							<BlogFAQSection faq={blog.faq} />
						</motion.article>
					</div>
				</div>
			</motion.main>

			{/* ✅ Contact Section */}
			<section>
				<Contact {...contactHome} />
			</section>
		</>
	);
}

export default BlogSinglePage;
