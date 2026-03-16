import * as styles from "./EntityNode.module.scss";
import LayerIconSvg from "@res/svg/small/layer.svg";
import MarkerIconSvg from "@res/svg/small/marker.svg";
import TrashIconSvg from "@res/svg/small/trash.svg";
import TileIconSvg from "@res/svg/small/tile.svg";
import FootnoteIconSvg from "@res/svg/small/footnote.svg";

import TreeLeafItemIconSvg from "@res/svg/small/tree-leaf-item.svg";
import TreeLeafOpenIconSvg from "@res/svg/small/tree-leaf-open.svg";
import TreeLeafCloseIconSvg from "@res/svg/small/tree-leaf-close.svg";

import {JSXElement, createMemo, createSignal} from "solid-js";
import {useSharedContext} from "@src/shared/context";
import {Entity, Parent} from "@src/entity/type";
import {Button, Icon} from "@src/shared/view";
import {EntityKind} from "@src/entity/enum";
import {useEditorContext} from "@src/editor/context";

type Props = {
    entityId: number;
    onClick?: (selected: unknown) => void;
};

export function EntityNode(props: Props): JSXElement {
    const {database} = useSharedContext();
    const editorContext = useEditorContext();

    const [isExpanded, setExpanded] = createSignal(false);

    const entityMemo = createMemo(() => {
        const entity = database.data.entity.select(props.entityId);
        if (!entity) throw new Error();
        return entity;
    });

    const isSelected = createMemo(() => {
        return editorContext.session.selected?.id == props.entityId;
    });

    function expand(): void {
        setExpanded(!isExpanded());
    }

    function isParent(entity: Entity): entity is Parent {
        return "childIds" in entity;
    }

    function onSelect(): void {
        editorContext.setSession({
            selected: entityMemo(),
        });
    }

    const childrenMemo = createMemo(() => {
        const entity = entityMemo();
        return isParent(entity)
            ? entity.childIds.map((id) => <EntityNode entityId={id}/>)
            : undefined;
    });

    const icons: {[key: string]: {label: string; icon: string}} = {
        [EntityKind.Layer]: {
            label: "layer",
            icon: LayerIconSvg,
        },
        [EntityKind.Tile]: {
            label: "tile",
            icon: TileIconSvg,
        },
        [EntityKind.Marker]: {
            label: "marker",
            icon: MarkerIconSvg,
        },
        [EntityKind.Footnote]: {
            label: "footnote",
            icon: FootnoteIconSvg,
        },
    };

    const boop = icons[entityMemo().kind]
        || {
            label: "undefined",
            icon: TrashIconSvg,
        };

    const leafIconMemo = createMemo(() =>
        !childrenMemo()
            ? TreeLeafItemIconSvg
            : isExpanded()
                ? TreeLeafOpenIconSvg
                : TreeLeafCloseIconSvg
    );

    return (
        <div
            class={styles.Node}
            classList={{
                [styles.Selected]: isSelected(),
                [styles.Expanded]: isExpanded(),
            }}
        >
            <div class={styles.Head} onClick={onSelect}>
                <Button
                    classList={{Icon: styles.Icon}}
                    icon={leafIconMemo()}
                    onClick={expand}
                />
                <Icon class={styles.Icon} svg={boop.icon}/>
                {boop.label} (id {entityMemo().id})
            </div>
            <div class={styles.Body}>
                {childrenMemo()}
            </div>
        </div>
    );
}
