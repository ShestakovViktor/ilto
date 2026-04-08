import {createMemo, JSX, ValidComponent} from "solid-js";
import {TileView, MarkerWidget, ImageView} from "@src/viewer/widget";
import {LayerView} from "@src/viewer/widget";
import {Dynamic} from "solid-js/web";
import {EntityKind} from "@src/core/enum";
import {DecorView} from "@src/viewer/widget";
import {AreaView} from "@src/viewer/widget";
import {FootnoteView} from "@src/viewer/widget";
import {useViewerContext} from "@src/viewer/context";

type Props = {
    entityId: number;
    ref?: HTMLDivElement | ((el: HTMLElement) => void);
    onMouseLeave?: (event: MouseEvent) => void;
};

export function EntityView(props: Props): JSX.Element {
    const {storage} = useViewerContext();

    const entity = createMemo(() => {
        const entity = storage.data.entity.select(props.entityId);
        if (!entity) throw new Error();
        return entity;
    });

    const entities: {[key: string]: ValidComponent} = {
        [EntityKind.Image]: ImageView,
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