import {Store, SetStoreFunction} from "solid-js/store";
import {Viewport} from "../controller";
import {ViewerState} from "@feature/viewer/type";

export type ViewerContext = {
    state: Store<ViewerState>;
    setState: SetStoreFunction<ViewerState>;

    viewport?: Viewport;

    path: string;
};