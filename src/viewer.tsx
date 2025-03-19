import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {Viewer} from "@feature/viewer/view";
import {ViewerContextProvider} from "@feature/viewer/context";
import {StoreContextProvider} from "@feature/store/context";

(async(): Promise<void> => {
    const container = document.querySelector("#viewer[data-src]");

    if (!container) return;

    const path = container.getAttribute("data-src");

    if (!path) throw new Error();

    const response = await fetch(path + "data.json");

    const data = await response.json();

    render(() => {
        return (
            <StoreContextProvider data={data}>
                <ViewerContextProvider path={path}>
                    <Viewer/>
                </ViewerContextProvider>
            </StoreContextProvider>
        );
    }, container);
})();