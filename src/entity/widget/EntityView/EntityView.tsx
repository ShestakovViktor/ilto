import {createMemo, JSX, ValidComponent} from "solid-js";
import {TileView, MarkerWidget} from "@src/entity/widget";
import {LayerView} from "@src/entity/widget";
import {Dynamic} from "solid-js/web";
import {EntityKind} from "@src/entity/enum";
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

    const entities: {[key: string]: ValidComponent} = {
        [EntityKind.Layer]: LayerView,
        [EntityKind.Tile]: TileView,
        [EntityKind.Footnote]: FootnoteView,
        [EntityKind.Marker]: MarkerWidget,
        [EntityKind.Decor]: DecorView,
        [EntityKind.Area]: AreaView,
    };

    return (
        <Dynamic
            component={entities[entity().kind]}
            entity={entity}
            ref={props.ref}
            onMouseLeave={props.onMouseLeave}
        />
    );
}