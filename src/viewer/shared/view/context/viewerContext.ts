import {type App, inject} from "vue";
import type {Viewer} from "@src/viewer/Viewer";

export const viewerContextKey = Symbol("viewerContext");

export function setViewerContext(app: App, viewer: Viewer): void {

	// const viewer = ref<ViewerState>({
	// 	mode: VIEWER_MODE.PRODUCTION,
	// });

	app.provide<Viewer>(viewerContextKey, viewer);
}

export function useViewerContext(): Viewer {
	const context = inject<Viewer>(viewerContextKey);

	if (!context) {
		throw new Error("There is no viewer context");
	}

	return context;
}