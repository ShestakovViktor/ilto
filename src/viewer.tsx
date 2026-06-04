import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {Storage} from "@src/storage/controller";
import {Viewer} from "@src/viewer/widget";
import {ViewerProvider} from "@src/viewer/context";
import {Viewport, Canvas, Scene} from "@src/viewer/controller";

(async(): Promise<void> => {
    const container = document.querySelector("#viewer[data-src]");

    if (!container) return;

    const path = container.getAttribute("data-src");

    if (!path) throw new Error();

    const response = await fetch(path + "data.json");

    const data = await response.json();

    const storage = new Storage(data);
    const viewport = new Viewport();
    const scene = new Scene();
    const canvas = new Canvas(storage);

    render(() => {
        return (
            <ViewerProvider
                module={{storage, viewport, canvas, scene}}
                path={path}
            >
                <Viewer/>
            </ViewerProvider>
        );
    }, container);
})();