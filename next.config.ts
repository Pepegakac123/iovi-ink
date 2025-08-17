import type { NextConfig } from "next";

const wordpressUrl = process.env.WORDPRESS_URL || "https://cms.iovi-ink.pl/";
const wordpressHostname = new URL(wordpressUrl).hostname;

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: wordpressHostname,
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;