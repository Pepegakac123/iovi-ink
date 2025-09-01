import type { NextConfig } from "next";

const wordpressUrl = process.env.WORDPRESS_URL || "https://cms.iovi-ink.pl/";
const wordpressHostname = new URL(wordpressUrl).hostname;

// 🔥 FAZA 1: CDN tylko dla Next.js assetów
const isProd = process.env.NODE_ENV === "production";
const cdnDomain = isProd ? "https://cdn.iovi-ink.pl" : undefined;

const nextConfig: NextConfig = {
	// output: "standalone", // Uncomment jeśli chcesz standalone

	// 🚀 CDN dla statycznych assetów Next.js (_next/static/*)
	assetPrefix: cdnDomain,

	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"motion",
			"@radix-ui/react-accordion",
			"@radix-ui/react-dialog",
			"@radix-ui/react-form",
		],
		serverComponentsHmrCache: false,
	},

	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},

	// 🔥 IMAGES - POZOSTAJĄ BEZ ZMIAN (WordPress images jak były)
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: wordpressHostname, // cms.iovi-ink.pl
				port: "",
				pathname: "/**",
			},
			// 🆕 DODAJ dla /public obrazów przez CDN
			{
				protocol: "https",
				hostname: "cdn.iovi-ink.pl",
				port: "",
				pathname: "/**",
			},
		],
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 31536000, // 1 rok cache
		loader: "default", // 🔥 POZOSTAW default - bez custom loadera
	},

	// ✅ Twoja istniejąca webpack config
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization.splitChunks = {
				chunks: "all",
				minSize: 0,
				maxSize: 244000,
				cacheGroups: {
					framework: {
						chunks: "all",
						name: "framework",
						test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
						priority: 50,
						enforce: true,
						reuseExistingChunk: true,
					},
					motion: {
						name: "motion",
						test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
						chunks: "all",
						priority: 40,
						reuseExistingChunk: true,
					},
					swiper: {
						name: "swiper",
						test: /[\\/]node_modules[\\/](swiper|swiper\/react)[\\/]/,
						chunks: "all",
						priority: 35,
						reuseExistingChunk: true,
					},
					ui: {
						name: "ui-radix",
						test: /[\\/]node_modules[\\/](@radix-ui)[\\/]/,
						chunks: "all",
						priority: 30,
						reuseExistingChunk: true,
					},
					icons: {
						name: "icons",
						test: /[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/,
						chunks: "all",
						priority: 25,
						reuseExistingChunk: true,
					},
					seo: {
						name: "seo",
						test: /[\\/]node_modules[\\/](next-seo)[\\/]/,
						chunks: "all",
						priority: 20,
						reuseExistingChunk: true,
					},
					vendor: {
						name: "vendor",
						test: /[\\/]node_modules[\\/]/,
						chunks: "all",
						priority: 15,
						minChunks: 2,
						reuseExistingChunk: true,
						maxSize: 100000,
					},
					commons: {
						name: "commons",
						chunks: "all",
						minChunks: 2,
						priority: 10,
						reuseExistingChunk: true,
						maxSize: 50000,
					},
				},
			};

			config.optimization.mergeDuplicateChunks = true;
			config.optimization.removeAvailableModules = true;
			config.optimization.removeEmptyChunks = true;
		}

		return config;
	},

	// 🔥 ROZSZERZONE HEADERS dla CDN
	async headers() {
		return [
			// Next.js statyczne assety - najdłuższy cache
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "CDN-Cache-Control",
						value: "public, max-age=31536000",
					},
				],
			},
			// Next.js optymalizowane obrazy
			{
				source: "/_next/image/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, stale-while-revalidate=86400",
					},
					{
						key: "CDN-Cache-Control",
						value: "public, max-age=2592000",
					},
				],
			},
			// Public folder assets (ikony z /public)
			{
				source: "/icons/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, stale-while-revalidate=86400",
					},
				],
			},
			// Inne statyczne pliki
			{
				source: "/:path*.{woff,woff2,ttf,eot}",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, stale-while-revalidate=86400",
					},
				],
			},
			{
				source: "/:path*.{ico,png,jpg,jpeg,gif,webp,svg}",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, stale-while-revalidate=86400",
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, stale-while-revalidate=86400",
					},
				],
			},
		];
	},

	compress: true,
	poweredByHeader: false,
};

export default nextConfig;
