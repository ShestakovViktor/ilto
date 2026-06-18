import {inject, type App} from "vue";
import type {CoreContext, Schema} from "@src/core/type";
import {initCoreModule} from "@src/core/context";

export const coreContextKey = Symbol("coreContext");

export function setCoreContext(
	app: App,
	params: {data?: Schema; path: string}
): void {
	const context = initCoreModule(params.data);
	app.provide<CoreContext>(coreContextKey, context);
}

export function useCoreContext(): CoreContext {
	const context = inject<CoreContext>(coreContextKey);
	if (!context) {
		throw new Error("");
	}
	return context;
}