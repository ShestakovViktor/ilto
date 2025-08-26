import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {Viewer} from "@src/viewer/widget";
import {ViewerProvider} from "@src/viewer/context";
import {SharedProvider} from "@src/shared/context";

(async(): Promise<void> => {
    const container = document.querySelector("#viewer[data-src]");

    if (!container) return;

    const path = container.getAttribute("data-src");

    if (!path) throw new Error();

    const response = await fetch(path + "data.json");

    const data = await response.json();

    render(() => {
        return (
            <SharedProvider data={data}>
                <ViewerProvider path={path}>
                    <Viewer/>
                </ViewerProvider>
            </SharedProvider>
        );
    }, container);
})();