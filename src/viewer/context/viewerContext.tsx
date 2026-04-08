import {JSX, createContext, useContext} from "solid-js";
import {ViewerContext} from "@src/viewer/type";
import {createStore} from "solid-js/store";
import {ViewerState} from "@src/viewer/type";
import {VIEWER_MODE} from "@src/viewer/enum";
import {Viewport} from "../controller";
import {Storage} from "@src/storage/controller";

type Props = {
    children: JSX.Element | JSX.Element[];
    path?: string;
    storage: Storage;
};

export const viewerContext = createContext<ViewerContext | undefined>();

export function ViewerProvider(props: Props): JSX.Element {
    const {storage} = props;
    const [viewer, setViewer] = createStore<ViewerState>({
        mode: VIEWER_MODE.PRODUCTION,
        x: 0,
        y: 0,
        scale: 1,
    });

    const viewport = new Viewport(setViewer);

    const value = {
        storage,
        viewer,
        setViewer,
        viewport,
        path: props.path || "",
    };

    return (
        <viewerContext.Provider value={value}>
            {props.children}
        </viewerContext.Provider>
    );
}

export function useViewerContext(): ViewerContext {
    const context = useContext(viewerContext);
    if (!context) {
        throw new Error("There is no viewer context");
    }
    return context;
}