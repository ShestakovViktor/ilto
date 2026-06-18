import type {ViewerContext} from "@src/viewer/type";
import type {ViewerState} from "@src/viewer/type";
import {type App, inject, ref} from "vue";
import {VIEWER_MODE} from "@src/viewer/enum";
import {initViewerModule} from "./viewerModule";
import type {CoreContext} from "@src/core/type";
import {coreContextKey} from "@src/core/context";

export const viewerContextKey = Symbol("viewerContext");

export function setViewerContext(app: App): void {
	const coreContext = app.runWithContext(
		() => inject<CoreContext>(coreContextKey)
	);

	if (!coreContext) throw new Error();

	const viewerModule = initViewerModule({storage: coreContext.storage});

	const viewer = ref<ViewerState>({
		mode: VIEWER_MODE.PRODUCTION,
		x: 0,
		y: 0,
		scale: 1,
	});

	app.provide<ViewerContext>(viewerContextKey, {
		...viewerModule,
		viewer,
	});
}

export function useViewerContext(): ViewerContext {
	const context = inject<ViewerContext>(viewerContextKey);

	if (!context) {
		throw new Error("There is no viewer context");
	}

	return context;
}