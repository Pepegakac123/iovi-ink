import { getAllPosts } from "@/lib/wordpress";
import Link from "next/link";
import Image from "next/image";
import { getAllServices } from "@/lib/jetApi";

export default async function Home() {
	const data = await getAllServices();
	return (
		<main className="text-center pt-16 px-5 bg-foreground font-sans">
			<h1 className="text-4xl md:text-5xl font-bold mb-7 text-primary">All posts</h1>
			<ul className="space-y-2">
				{data.length > 0 ? (
					data.map((post) => (
						<li key={post.id}>
							<h2>{post.title.rendered}</h2>
						</li>
						
					))
				) : (
					<h2>Nie ma postów</h2>
				)}
			</ul>
		</main>
	);
}
