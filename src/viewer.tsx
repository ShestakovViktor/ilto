import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {Viewer} from "@src/ui/viewer/widget";
import {ViewerProvider} from "@ui/viewer/context";
import {Store} from "@core";
import {SignalProvider, StoreProvider} from "@ui/app/context";

(async(): Promise<void> => {
    const container = document.querySelector("#viewer[data-src]");

    if (!container) return;

    const path = container.getAttribute("data-src");

    const response = await fetch(path + "/data.json");

    const data = await response.json();

    const store = new Store();

    store.setData(data);

    render(() => {
        return (
            <SignalProvider>
                <StoreProvider store={store}>
                    <ViewerProvider>
                        <Viewer/>
                    </ViewerProvider>
                </StoreProvider>
            </SignalProvider>
        );
    }, container);
})();