/// <reference types="@rsbuild/core/types" />

declare module "*.css" {
	const content: string;
	export default content;
}

declare module "*.svg?raw" {
	const content: string;
	export default content;
}

declare module "*.html" {
	const content: string;
	export default content;
}

declare module "*.scss";

declare module "*.module.scss" {
	const classes: Readonly<Record<string, string>>;
	export default classes;
}

declare module "*.vue" {
	import type {DefineComponent} from "vue";
	const component:
	DefineComponent<Record<string, unknown>,
		Record<string, unknown>,
		unknown
	>;
	export default component;
}

declare module "*.vert" {
	const content: string;
	export default content;
}

declare module "*.frag" {
	const content: string;
	export default content;
}

declare module "*.glsl" {
	const content: string;
	export default content;
}