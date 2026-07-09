import path from "path";
import {defineConfig} from "@rsbuild/core";
import {pluginVue} from "@rsbuild/plugin-vue";
import {pluginSass} from "@rsbuild/plugin-sass";

export default defineConfig({
	plugins: [
		pluginVue(),
		pluginSass(),
	],

	source: {
		entry: {
			editor: "./src/editor.ts",
			viewer: "./src/viewer.ts",
		},
	},

	resolve: {
		alias: {
			"@src": path.resolve(__dirname, "./src"),
		},
	},

	output: {
		distPath: {
			root: "build",
			js: "./",
			jsAsync: "./",
		},
		assetPrefix: process.env.NODE_ENV === "production" ? "/ilto" : "/",

		injectStyles: true,

		legalComments: "none",

		sourceMap: {
			js: "cheap-module-source-map",
		},

		filename: {
			js: (pathData) => {
				if (pathData.chunk?.name === "viewer") {
					return "viewer.js";
				}

				return process.env.NODE_ENV === "production"
					? "editor.[contenthash:8].js"
					: "editor.[name].js";
			},

			css: process.env.NODE_ENV === "production"
				? "editor.[contenthash:8].css"
				: "editor.css",
		},
	},

	html: {
		meta: {
			charset: {charset: "UTF-8"},
		},
		template: ({entryName}) => {
			const templates = {
				editor: "./src/editor.html",
				viewer: "./src/viewer.html",
			};
			return templates[entryName as keyof typeof templates];
		},
		inject: ({entryName}) => entryName === "viewer" ? "body" : "head",
	},
	tools: {
		htmlPlugin(config, {entryName}) {
			if (entryName === "editor") {
				config.filename = "index.html";
			}
		},
		rspack: {
			module: {
				rules: [
					{
						test: /\.(vert|frag|glsl)$/,
						type: "asset/source",
					},
				],
			},
		},
	},
	performance: {
		chunkSplit: {
			strategy: "custom",
			splitChunks: {
				chunks: (chunk) => chunk.name !== "viewer",
			},
		},
	},

	server: {
		port: 3000,
	},
});