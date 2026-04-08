import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";
import {Editor} from "@src/editor/widget";
import {EditorProvider} from "@src/editor/context";
import {ViewerProvider} from "@src/viewer/context";
import {CoreProvider} from "@src/core/context";
import {Storage} from "@src/storage/controller";

const container = document.querySelector("#editor");
if (!container) throw new Error("There is no container element");

const storage = new Storage();

render(() =>
    <CoreProvider>
        <ViewerProvider storage={storage}>
            <EditorProvider storage={storage}>
                <Editor/>
            </EditorProvider>
        </ViewerProvider>
    </CoreProvider>
, container);
