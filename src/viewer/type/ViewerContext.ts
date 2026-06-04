import {Store, SetStoreFunction} from "solid-js/store";
import {Canvas, Scene, Viewport} from "@src/viewer/controller";
import {ViewerState} from "@src/viewer/type";
import {Storage} from "@src/storage/controller";

export type ViewerContext = {
    viewer: Store<ViewerState>;
    setViewer: SetStoreFunction<ViewerState>;

    viewport: Viewport;
    canvas: Canvas;
    scene: Scene;

    path: string;

    storage: Storage;
};