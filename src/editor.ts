import "@src/style/colors.scss";
import "@src/style/global.scss";

import {createApp, reactive} from "vue";
import {Editor as EditorComponent} from "@src/editor/view";
import {setCoreContext} from "@src/core/view/context";
import {setViewerContext} from "@src/viewer/view/context";
import {setEditorContext, setScopeContext} from "@src/editor/view/context";

import {Core} from "@src/core/Core";
import {Viewer} from "@src/viewer/Viewer";
import {Editor} from "@src/editor/Editor";
import type {Stats} from "@src/core/type";
import type {Telemetry} from "@src/viewer/type";
import type {Session} from "@src/editor/type";
import {ActivityKind, InputKind} from "@src/editor/enum";

const stats: Stats = reactive({
	revision: 0,
});

const core = new Core(stats);

const telemetry: Telemetry = reactive({
	fps: 0,
});

const viewer = new Viewer(core, telemetry);

const session: Session = reactive({
	selected: undefined,
	layer: undefined,
	activity: {kind: ActivityKind.System},
	history: [{kind: ActivityKind.System}],
	input: InputKind.DefaultView,
	notification: [],
	modal: [],
});
const editor = new Editor(core, viewer, session);

const app = createApp(EditorComponent);
app.use(setScopeContext);
app.use(setCoreContext, core);
app.use(setViewerContext, viewer);
app.use(setEditorContext, editor);

const container = document.querySelector("#root");
if (!container) throw new Error("There is no container element");
app.mount(container);