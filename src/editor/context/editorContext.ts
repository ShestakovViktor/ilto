import {type App, inject, ref, watch, watchEffect} from "vue";
import type {EditorContext, Session, Updater} from "@src/editor/type";
import {initEditorModule} from "@src/editor/context";
import {viewerContextKey} from "@src/viewer/context";
import type {ViewerContext, ViewerState} from "@src/viewer/type";
import type {CoreContext} from "@src/core/type";
import {coreContextKey} from "@src/core/context";
import {InputMode, ActivityMode} from "@src/editor/enum";

export const editorContextKey = Symbol("editorContext");

export function setEditorContext(app: App): void {
	const coreContext = app.runWithContext(
		() => inject<CoreContext>(coreContextKey)
	);

	if (!coreContext) throw new Error();

	const viewerContext = app.runWithContext(
		() => inject<ViewerContext>(viewerContextKey)
	);

	if (!viewerContext) throw new Error();

	const session = ref<Session>({
		selected: undefined,
		layer: undefined,
		activityMode: ActivityMode.System,
		activityHistory: [ActivityMode.System],
		inputMode: InputMode.DefaultView,
		notification: [],
		modal: [],
	});

	watch(
		() => session.value.activityMode,
		(activityMode) => session.value.activityHistory.push(activityMode)
	);

	const editorModule = initEditorModule({
		storage: coreContext.storage,
		linker: coreContext.linker,
		fetcher: coreContext.fetcher,
		archiver: coreContext.archiver,
		graphics: coreContext.graphics,

		loop: viewerContext.loop,

		getViewer(): ViewerState {return viewerContext.viewer.value;},
		setViewer(updater: Updater<ViewerState>) {
			if (typeof updater === "function") {
				updater(viewerContext.viewer.value);
			}
			else {
				Object.assign(viewerContext.viewer.value, updater);
			}
		},

		getSession(): Session {return session.value;},
		setSession(updater: Updater<Session>) {
			if (typeof updater === "function") {
				updater(session.value);
			}
			else {
				Object.assign(session.value, updater);
			}
		},
	});

	watchEffect(() => {
		editorModule.mouse.setMode(session.value.inputMode);
	});

	app.provide<EditorContext>(editorContextKey, {
		...editorModule,
		session,
	});
}

export function useEditorContext(): EditorContext {
	const context = inject<EditorContext>(editorContextKey);

	if (!context) {
		throw new Error("There is no editor context");
	}

	return context;
}
