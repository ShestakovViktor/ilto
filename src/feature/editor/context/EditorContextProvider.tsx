import {createEffect, createSignal, JSX, on} from "solid-js";
import {createStore} from "solid-js/store";
import {EditorContextObject} from "@feature/editor/context";
import {INPUT_MODE} from "@feature/editor/enum";
import {WebArchiveDriver, WebImageDriver} from "@feature/editor/controller/driver";
import {EditorState} from "@feature/editor/type";
import {Entity, Parent} from "@feature/entity/type";
import {Invoker} from "@feature/editor/controller/Invoker";

type Props = {
    children: JSX.Element | JSX.Element[];
};

export function EditorContextProvider(props: Props): JSX.Element {
    const [selected, setSelected] = createSignal<Entity | undefined>();
    const [layer, setLayer] = createSignal<Entity & Parent | undefined>();

    const invoker = new Invoker();

    const archiveDriver = new WebArchiveDriver();
    const imageDriver = new WebImageDriver();

    const [state, setState] = createStore<EditorState>({
        dockArea: {
            items: [],
        },
        inputMode: INPUT_MODE.ETITY_SELECT,
    });

    createEffect(on(selected, (curr, prev) => {
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
    }));

    const value = {
        selected,
        setSelected,

        invoker,

        layer,
        setLayer,

        state,
        setState,

        archiveDriver,
        imageDriver,
    };

    return (
        <EditorContextObject.Provider value={value}>
            {props.children}
        </EditorContextObject.Provider>
    );
}