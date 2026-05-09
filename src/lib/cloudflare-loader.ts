// src/lib/cloudflare-loader.ts

interface CloudflareLoaderParams {
	src: string;
	width: number;
	quality?: number; // 'quality' nadal tu jest, ale go zignorujemy
}

const CLOUDFLARE_RESIZER_DOMAIN = "iovi-ink.pl";

// Globalna, zbalansowana jakość dla całej witryny
const GLOBAL_QUALITY = 80;

export default function cloudflareLoader({
	src,
	width,
	quality, // Zignorujemy tę wartość
}: CloudflareLoaderParams): string {
	if (!src || src.startsWith("/")) {
		return src;
	}

	try {
		new URL(src);
	} catch (e) {
		console.warn(`[Cloudflare Loader] Niepoprawny URL obrazu: ${src}`);
		return src;
	}

	// 3. Budowanie parametrów transformacji
	const params = [
		`width=${width}`,
		`quality=${quality || GLOBAL_QUALITY}`,
		"format=auto",
	];

	return `https://${CLOUDFLARE_RESIZER_DOMAIN}/cdn-cgi/image/${params.join(
		",",
	)}/${src}`;
}
