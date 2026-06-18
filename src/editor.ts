import "@src/style/colors.scss";
import "@src/style/global.scss";

import {createApp} from "vue";
import {Editor} from "@src/editor/view";
import {setCoreContext} from "@src/core/context";
import {setViewerContext} from "@src/viewer/context";
import {
	setEditorContext,
	setScopeContext,
} from "@src/editor/context";

const app = createApp(Editor);
app.use(setCoreContext, {path: ""});
app.use(setViewerContext);
app.use(setScopeContext);
app.use(setEditorContext);

const container = document.querySelector("#root");
if (!container) throw new Error("There is no container element");
app.mount(container);