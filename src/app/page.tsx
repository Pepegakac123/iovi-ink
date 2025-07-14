import { getAllPosts } from "@/lib/wordpress";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
	const data = await getAllPosts();

	return (
		<main className="text-center pt-16 px-5">
			<h1 className="text-4xl md:text-5xl font-bold mb-7">All posts</h1>
			<ul className="space-y-2">
				{data.length > 0 ? (
					data.map((post) => (
						<li key={post.id}>
							<Link href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
						</li>
					))
				) : (
					<h2>Nie ma postów</h2>
				)}
			</ul>
		</main>
	);
}
