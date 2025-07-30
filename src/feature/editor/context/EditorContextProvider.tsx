import {createEffect, JSX} from "solid-js";
import {createStore} from "solid-js/store";
import {EditorContextObject} from "@feature/editor/context";
import {INPUT_MODE} from "@feature/editor/enum";
import {EditorContext, EditorState} from "@feature/editor/type";
import {Entity} from "@feature/entity/type";

type Props = {
    children: JSX.Element | JSX.Element[];
};

export function EditorContextProvider(props: Props): JSX.Element {
    const [state, setState] = createStore<EditorState>({
        selected: undefined,
        layer: undefined,
        dockArea: {
            items: [],
        },
        inputMode: INPUT_MODE.ETITY_SELECT,
        notification: [],
    });

    let prev: Entity | undefined;
    let curr: Entity | undefined;

    createEffect(() => {
        curr = state.selected;

        if (prev) {
            const prevSelected = document
                .querySelector(`[data-entity-id="${prev.id}"]`);
            if (prevSelected) prevSelected.classList.remove("Selected");
        }

        if (curr) {
            const currSelected = document
                .querySelector(`[data-entity-id="${curr.id}"]`);

            if (currSelected) currSelected.classList.add("Selected");
        }

        prev = curr;
    });

    const value = {
        state,
        setState,
    } as EditorContext;

    return (
        <EditorContextObject.Provider value={value}>
            {props.children}
        </EditorContextObject.Provider>
    );
}