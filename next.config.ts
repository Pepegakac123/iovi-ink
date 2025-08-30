import type { NextConfig } from "next";

const wordpressUrl = process.env.WORDPRESS_URL || "https://cms.iovi-ink.pl/";
const wordpressHostname = new URL(wordpressUrl).hostname;

const nextConfig: NextConfig = {
	// output: "standalone",

	// ✅ Experimental features dla wydajności
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

	// ✅ Compiler optimizations
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},

	// ✅ Images z cache headers
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: wordpressHostname,
				port: "",
				pathname: "/**",
			},
		],
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},

	// ✅ AGRESYWNE bundle splitting - FIX dla 215kB vendor chunk
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization.splitChunks = {
				chunks: "all",
				minSize: 0,
				maxSize: 244000, // 244kB max per chunk
				cacheGroups: {
					// ✅ Framework chunk (React, Next.js) - krytyczne
					framework: {
						chunks: "all",
						name: "framework",
						test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
						priority: 50,
						enforce: true,
						reuseExistingChunk: true,
					},

					// ✅ Motion w osobnym chunku - lazy loadowany
					motion: {
						name: "motion",
						test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
						chunks: "all",
						priority: 40,
						reuseExistingChunk: true,
					},

					// ✅ Swiper w osobnym chunku - tylko dla CarouselSections
					swiper: {
						name: "swiper",
						test: /[\\/]node_modules[\\/](swiper|swiper\/react)[\\/]/,
						chunks: "all",
						priority: 35,
						reuseExistingChunk: true,
					},

					// ✅ UI Libraries - Radix UI components
					ui: {
						name: "ui-radix",
						test: /[\\/]node_modules[\\/](@radix-ui)[\\/]/,
						chunks: "all",
						priority: 30,
						reuseExistingChunk: true,
					},

					// ✅ Icons w osobnym chunku
					icons: {
						name: "icons",
						test: /[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/,
						chunks: "all",
						priority: 25,
						reuseExistingChunk: true,
					},

					// ✅ Next SEO - używane tylko na niektórych stronach
					seo: {
						name: "seo",
						test: /[\\/]node_modules[\\/](next-seo)[\\/]/,
						chunks: "all",
						priority: 20,
						reuseExistingChunk: true,
					},

					// ✅ Pozostałe vendor libraries
					vendor: {
						name: "vendor",
						test: /[\\/]node_modules[\\/]/,
						chunks: "all",
						priority: 15,
						minChunks: 2,
						reuseExistingChunk: true,
						maxSize: 100000, // Maksymalnie 100kB na vendor chunk
					},

					// ✅ Commons - shared code między stronami
					commons: {
						name: "commons",
						chunks: "all",
						minChunks: 2,
						priority: 10,
						reuseExistingChunk: true,
						maxSize: 50000, // 50kB max
					},
				},
			};

			// ✅ Optymalizacje dla małych chunków
			config.optimization.mergeDuplicateChunks = true;
			config.optimization.removeAvailableModules = true;
			config.optimization.removeEmptyChunks = true;
		}

		return config;
	},

	// ✅ Headers dla cache
	async headers() {
		return [
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},

	compress: true,
	poweredByHeader: false,
};

export default nextConfig;
