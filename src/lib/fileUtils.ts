import sharp from "sharp";

export async function convertFileToWebP(
	file: File,
	email: string,
): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Sprawdź czy to obraz, który chcemy konwertować
	const isImage = file.type.startsWith("image/");
	const isGif = file.type === "image/gif";
	const isSvg = file.type === "image/svg+xml";

	if (isImage && !isGif && !isSvg) {
		try {
			const webpBuffer = await sharp(buffer)
				.webp({ quality: 80 })
				.resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
				.toBuffer();

			const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, "-");
			const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "-");
			const originalName = file.name.split(".")[0];
			const filename = `client-${timestamp}-${safeEmail}-${originalName}.webp`;

			return { buffer: webpBuffer, filename, mimeType: "image/webp" };
		} catch (error) {
			console.error(`Sharp conversion error for ${file.name}:`, error);
			// W przypadku błędu sharp, zwróć oryginalny plik
			return { buffer, filename: file.name, mimeType: file.type };
		}
	}

	// Dla PDF, GIF, SVG i innych typów zwróć oryginał
	return { buffer, filename: file.name, mimeType: file.type };
}
