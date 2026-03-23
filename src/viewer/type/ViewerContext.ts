import {Store, SetStoreFunction} from "solid-js/store";
import {ViewManager} from "../controller";
import {ViewerState} from "@src/viewer/type";
import {Storage} from "@src/storage/controller";

export type ViewerContext = {
    viewer: Store<ViewerState>;
    setViewer: SetStoreFunction<ViewerState>;

    viewManager: ViewManager;
    path: string;

    storage: Storage;
};