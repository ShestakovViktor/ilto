import {Store, SetStoreFunction} from "solid-js/store";
import {ViewManager} from "../controller";
import {ViewerState} from "@src/viewer/type";

export type ViewerContext = {
    viewer: Store<ViewerState>;
    setViewer: SetStoreFunction<ViewerState>;

    viewManager: ViewManager;
    path: string;
};