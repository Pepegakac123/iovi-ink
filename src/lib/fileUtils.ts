import sharp from "sharp";

export async function convertToWebP(
	file: File,
	email: string,
): Promise<{ buffer: Buffer; filename: string }> {
	// 1. Konwertuj File na Buffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// 2. Konwertuj na WebP z kompresją
	const webpBuffer = await sharp(buffer)
		.webp({ quality: 80 }) // 80% jakości = dobry kompromis
		.toBuffer();

	// 3. Wygeneruj nazwę pliku
	const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, "-"); // 2024-01-15T14-30
	const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "-"); // jan@gmail.com -> jan-gmail-com
	const originalName = file.name.split(".")[0]; // usuń rozszerzenie

	const filename = `client-${timestamp}-${safeEmail}-${originalName}.webp`;

	return { buffer: webpBuffer, filename };
}
