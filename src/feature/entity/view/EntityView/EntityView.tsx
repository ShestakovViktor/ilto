import {createMemo, JSX, ValidComponent} from "solid-js";
import {TileView} from "@feature/tile/view";
import {LayerView} from "@feature/layer/view";
import {MarkerView} from "@feature/marker/view";
import {Dynamic} from "solid-js/web";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {DecorView} from "@feature/decor/view";
import {AreaView} from "@feature/area/view";
import {FootnoteView} from "@feature/footnote/view";
import {useStoreContext} from "@feature/store/context";

type Props = {
    entityId: number;
    ref?: HTMLDivElement | ((el: HTMLElement) => void);
    onMouseLeave?: (event: MouseEvent) => void;
};

export function EntityView(props: Props): JSX.Element {
    const storeContext = useStoreContext();

    const entity = createMemo(() => {
        const entity = storeContext.store.entity.select(props.entityId);
        if (!entity) throw new Error();
        return entity;
    });

    const entities: {[key: string]: ValidComponent} = {
        [ENTITY_TYPE.LAYER]: LayerView,
        [ENTITY_TYPE.TILE]: TileView,
        [ENTITY_TYPE.FOOTNOTE]: FootnoteView,
        [ENTITY_TYPE.MARKER]: MarkerView,
        [ENTITY_TYPE.DECOR]: DecorView,
        [ENTITY_TYPE.AREA]: AreaView,
    };

    return (
        <Dynamic
            component={entities[entity().entityTypeId]}
            entity={entity}
            ref={props.ref}
            onMouseLeave={props.onMouseLeave}
        />
    );
}