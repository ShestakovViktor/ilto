import "@src/i18n";
import "@res/style/colors.scss";
import "@res/style/global.scss";

import {render} from "solid-js/web";

import {Editor} from "@src/editor/widget";
import {EditorProvider} from "@src/editor/context";
import {ViewerProvider} from "@src/viewer/context";
import {CoreProvider} from "@src/core/context";

import {Storage} from "@src/storage/controller";
import {Viewport, Scene, Canvas} from "@src/viewer/controller";
import {createEffect, on} from "solid-js";
import {Entity, Spatial, Size, isParent} from "@src/core/type";

const container = document.querySelector("#editor");
if (!container) throw new Error("There is no container element");

const storage = new Storage();
const viewport = new Viewport();
const scene = new Scene();
const canvas = new Canvas(storage);

render(() => {
    createEffect(on(storage.reloaded, () => {
        const [width] = storage.data.config.filter({name: "width"});
        const [height] = storage.data.config.filter({name: "height"});

        scene.init(Number(width.number), Number(height.number));

        function foo(id: number) {
            const entity = storage.data.entity
                .select<Entity & Spatial & Size>(id);

            if (!entity) return;

            scene.add({
                id: entity.id,
                x: entity.x,
                y: entity.y,
                w: entity.w,
                h: entity.h,
            });

            if (isParent(entity)) {
                entity.childIds.forEach((id) => foo(id));
            }
        }

        foo(1);

    }));

    return <CoreProvider>
        <ViewerProvider module={{storage, viewport, scene, canvas}}>
            <EditorProvider storage={storage}>
                <Editor/>
            </EditorProvider>
        </ViewerProvider>
    </CoreProvider>;
}, container);
