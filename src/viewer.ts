import "@src/shared/style/colors.scss";
import "@src/shared/style/global.scss";

import {createApp, reactive} from "vue";
import {Editor} from "@src/editor/view";
import {setStorageContext} from "@src/storage/view/context";
import {setViewerContext} from "@src/viewer/shared/view/context";
import {Storage} from "@src/storage/Storage";
import type {Telemetry} from "./viewer/shared/type";
import {Viewer} from "./viewer/Viewer";

(async(): Promise<void> => {
	const container = document.querySelector("#viewer[data-src]");

	if (!container) return;

	const path = container.getAttribute("data-src");

	if (!path) throw new Error();

	const response = await fetch(path + "data.json");

	const data = await response.json();

	const storage = new Storage(data);
	const telemetry: Telemetry = reactive({
		fps: 0,
		x: 0,
		y: 0,
		s: 0,
	});

	const viewer = new Viewer(storage, telemetry);

	const app = createApp(Editor);
	app.use(setStorageContext, storage);
	app.use(setViewerContext, viewer);
})();

