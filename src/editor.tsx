import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {Editor} from "@src/editor/widget";
import {EditorProvider} from "@src/editor/context";
import {ViewerProvider} from "@src/viewer/context";
import {SharedProvider} from "@src/shared/context";

const container = document.querySelector("#editor");
if (!container) throw new Error("There is no container element");

render(() =>
    <SharedProvider>
        <ViewerProvider>
            <EditorProvider>
                <Editor/>
            </EditorProvider>
        </ViewerProvider>
    </SharedProvider>
, container);
