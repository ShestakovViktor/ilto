import {JSX, Show, ValidComponent, createMemo} from "solid-js";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {useEditorContext} from "@feature/editor/context";
import {Dynamic} from "solid-js/web";
import {MarkerForm} from "@feature/marker/view";
import {DecorForm} from "@feature/decor/view";
import {AreaForm} from "@feature/area/view";

export function EntityForm(): JSX.Element {
    const editorContext = useEditorContext();

    const entity = createMemo(() => editorContext.selected());

    const entities: {[key: string]: ValidComponent} = {
        [ENTITY_TYPE.MARKER]: MarkerForm,
        [ENTITY_TYPE.DECOR]: DecorForm,
        [ENTITY_TYPE.AREA]: AreaForm,
    };

    return (
        <Show when={entity()} fallback={<h1>No entity</h1>}>
            {(entity) =>
                <Dynamic
                    component={entities[entity().entityTypeId]}
                    entity={entity}
                />
            }
        </Show>
    );
}