import {createContext, useContext} from "solid-js";
import {EditorContext} from "@feature/editor/type";

export const EditorContextObject = createContext<EditorContext | undefined>();

export function useEditorContext(): EditorContext {
    const context = useContext(EditorContextObject);

    if (!context) {
        throw new Error("There is no editor context");
    }

    return context;
}

