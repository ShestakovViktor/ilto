import {createMemo, JSX, ValidComponent} from "solid-js";
import {TileView, MarkerWidget} from "@src/entity/widget";
import {LayerView} from "@src/entity/widget";
import {Dynamic} from "solid-js/web";
import {ENTITY_TYPE} from "@src/entity/enum";
import {DecorView} from "@src/entity/widget";
import {AreaView} from "@src/entity/widget";
import {FootnoteView} from "@src/entity/widget";
import {useSharedContext} from "@src/shared/context";

type Props = {
    entityId: number;
    ref?: HTMLDivElement | ((el: HTMLElement) => void);
    onMouseLeave?: (event: MouseEvent) => void;
};

export function EntityView(props: Props): JSX.Element {
    const {database} = useSharedContext();

    const entity = createMemo(() => {
        const entity = database.data.entity.select(props.entityId);
        if (!entity) throw new Error();
        return entity;
    });

    const [layerType] = database.data.entityType
        .filter({name: ENTITY_TYPE.LAYER});

    const [tileType] = database.data.entityType
        .filter({name: ENTITY_TYPE.TILE});

    const [markerType] = database.data.entityType
        .filter({name: ENTITY_TYPE.MARKER});

    const entities: {[key: string]: ValidComponent} = {
        [layerType.id]: LayerView,
        [tileType.id]: TileView,
        [ENTITY_TYPE.FOOTNOTE]: FootnoteView,
        [markerType.id]: MarkerWidget,
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