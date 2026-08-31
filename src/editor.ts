import "@src/shared/style/colors.scss";
import "@src/shared/style/global.scss";

import {createApp, reactive} from "vue";
import {Editor as EditorComponent} from "@src/editor/view";
import {setStorageContext} from "@src/storage/view/context";
import {setViewerContext} from "@src/viewer/shared/view/context";
import {setEditorContext, setScopeContext} from "@src/editor/view/context";

import {Storage} from "@src/storage/Storage";
import {Viewer} from "@src/viewer/Viewer";
import {Editor} from "@src/editor/Editor";
import type {Stats} from "@src/storage/type";
import type {Telemetry} from "@src/viewer/shared/type";
import type {Session} from "@src/editor/type";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";

const stats: Stats = reactive({
	revision: 0,
});

const storage = new Storage(stats);

const telemetry: Telemetry = reactive({
	fps: 0,
	x: 0,
	y: 0,
	s: 0,
});

const viewer = new Viewer(storage, telemetry);

const session: Session = reactive({
	selected: undefined,
	activity: {
		target: ActivityTarget.System,
		action: ActivityAction.Setup,
	},
	draft: {target: ActivityTarget.Void},
	history: [],
	notification: [],
	modal: [],
	adorner: {},
});
const editor = new Editor(storage, viewer, session);

const app = createApp(EditorComponent);
app.use(setScopeContext);
app.use(setStorageContext, storage);
app.use(setViewerContext, viewer);
app.use(setEditorContext, editor);

const container = document.querySelector("#root");
if (!container) throw new Error("There is no container element");
app.mount(container);