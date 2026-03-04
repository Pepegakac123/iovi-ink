// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	console.log("🚀 Revalidate endpoint called");
	console.log("URL:", request.url);

	const { searchParams } = new URL(request.url);
	console.log("Search params:", Object.fromEntries(searchParams));

	const secret = searchParams.get("secret");
	const tags = searchParams.get("tags");

	console.log("Secret:", secret ? "PROVIDED" : "MISSING");
	console.log("Tags:", tags);

	if (secret !== process.env.REVALIDATION_SECRET) {
		console.log("❌ Secret mismatch");
		return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
	}

	if (!tags) {
		console.log("❌ No tags provided");
		return NextResponse.json({ message: "No tags provided" }, { status: 400 });
	}

	try {
		const tagsList = tags.split(",");
		console.log("🔄 Revalidating tags:", tagsList);

		// Revalidating tags concurrently
		await Promise.all(
			tagsList.map(async (tag) => {
				const trimmedTag = tag.trim();
				console.log(`Revalidating: ${trimmedTag}`);
				// In Next.js 15+ revalidateTag is async and requires type option
				revalidateTag(trimmedTag, "tag");
			}),
		);

		revalidatePath("/sitemap.xml");
		console.log("✅ Revalidation complete");
		return NextResponse.json({
			success: true,
			revalidated: tagsList,
		});
	} catch (error) {
		console.log("❌ Error:", error);
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}
