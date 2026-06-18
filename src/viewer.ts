import "@src/style/colors.scss";
import "@src/style/global.scss";

import {createApp} from "vue";
import {Editor} from "@src/editor/view";
import {setCoreContext} from "@src/core/context";
import {setViewerContext} from "@src/viewer/context";

(async(): Promise<void> => {
	const container = document.querySelector("#viewer[data-src]");

	if (!container) return;

	const path = container.getAttribute("data-src");

	if (!path) throw new Error();

	const response = await fetch(path + "data.json");

	const data = await response.json();

	const app = createApp(Editor);
	app.use(setCoreContext, {data, path});
	app.use(setViewerContext);
})();

