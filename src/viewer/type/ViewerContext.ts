import {Store, SetStoreFunction} from "solid-js/store";
import {Viewport} from "../controller";
import {ViewerState} from "@src/viewer/type";
import {Storage} from "@src/storage/controller";

export type ViewerContext = {
    viewer: Store<ViewerState>;
    setViewer: SetStoreFunction<ViewerState>;

    viewport: Viewport;
    path: string;

    storage: Storage;
};