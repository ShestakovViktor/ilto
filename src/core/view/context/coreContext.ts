import {inject, type App} from "vue";
import type {Core} from "@src/core/Core";

export const coreContextKey = Symbol("coreContext");

export function setCoreContext(app: App, core: Core): void {
	app.provide<Core>(coreContextKey, core);
}

export function useCoreContext(): Core {
	const context = inject<Core>(coreContextKey);

	if (!context) {
		throw new Error("");
	}

	return context;
}