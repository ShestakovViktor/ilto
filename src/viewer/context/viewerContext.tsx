import {JSX, createContext, useContext} from "solid-js";
import {ViewerContext} from "@src/viewer/type";
import {createStore} from "solid-js/store";
import {ViewerState} from "@src/viewer/type";
import {VIEWER_MODE} from "@src/viewer/enum";
import {ViewManager} from "../controller";

type Props = {
    children: JSX.Element | JSX.Element[];
    path?: string;
};

export const viewerContext = createContext<ViewerContext | undefined>();

export function ViewerProvider(props: Props): JSX.Element {
    const [viewer, setViewer] = createStore<ViewerState>({
        mode: VIEWER_MODE.PRODUCTION,
        scale: 1,
    });

    const viewManager = new ViewManager(setViewer);

    const value = {
        viewer,
        setViewer,
        viewManager,
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