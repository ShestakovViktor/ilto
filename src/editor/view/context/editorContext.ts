import {type App, inject, reactive} from "vue";
import type {Editor} from "@src/editor/Editor";
import type {EditorContext} from "@src/editor/type";

export const editorContextKey = Symbol("editorContext");

export function setEditorContext(app: App, editor: Editor): void {
	const context = {
		session: reactive(editor.session),

		uid: editor.uid,
		notif: editor.notif,
		log: editor.log,
		engine: editor.engine,
		mouse: editor.mouse,
		hotkey: editor.hotkey,
	};

	editor.session = context.session;

	app.provide<EditorContext>(editorContextKey, context);
}

export function useEditorContext(): EditorContext {
	const context = inject<EditorContext>(editorContextKey);

	if (!context) {
		throw new Error("There is no editor context");
	}

	return context;
}
