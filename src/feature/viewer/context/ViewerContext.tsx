import {createContext, useContext} from "solid-js";
import {ViewerContext} from "@feature/viewer/type";

export const ViewerContextObject = createContext<ViewerContext | undefined>();

export function useViewerContext(): ViewerContext {
    const context = useContext(ViewerContextObject);
    if (!context) {
        throw new Error("There is no viewer context");
    }
    return context;
}
