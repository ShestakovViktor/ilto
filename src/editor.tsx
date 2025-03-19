import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {StartupDialog, Editor, ModalLayer} from "@feature/editor/view";
import {createSignal, Match, Switch} from "solid-js";
import {Data} from "@type";
import {StoreContextProvider} from "@feature/store/context";
import {NamespaceContextProvider} from "@feature/app/context";
import {EditorContextProvider, StartupContextProvider} from "@feature/editor/context";
import {ViewerContextProvider} from "@feature/viewer/context";

const container = document.querySelector("#editor");
if (!container) throw new Error("There is no container element");

const dataSignal = createSignal<Data>();
const [data] = dataSignal;

render(() =>
    <Switch>
        <Match when={!data()}>
            <StartupContextProvider dataSignal={dataSignal}>
                <ModalLayer>
                    <StartupDialog/>
                </ModalLayer>
            </StartupContextProvider>
        </Match>
        <Match when={data()}>
            <StoreContextProvider data={data()!}>
                <NamespaceContextProvider namespace={"Editor"}>
                    <ViewerContextProvider>
                        <EditorContextProvider>
                            <Editor/>
                        </EditorContextProvider>
                    </ViewerContextProvider>
                </NamespaceContextProvider>
            </StoreContextProvider>
        </Match>
    </Switch>
, container);
