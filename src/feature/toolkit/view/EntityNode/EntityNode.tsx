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
import {useStoreContext} from "@feature/store/context";
import {Entity, Parent} from "@feature/entity/type";
import {Button, Icon} from "@shared/view";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {useEditorContext} from "@feature/editor/context";

type Props = {
    entityId: number;
    onClick?: (selected: unknown) => void;
};

export function EntityNode(props: Props): JSXElement {
    const storeContext = useStoreContext();
    const editorContext = useEditorContext();

    const [isExpanded, setExpanded] = createSignal(false);

    const entityMemo = createMemo(() => {
        const entity = storeContext.store.entity.select(props.entityId);
        if (!entity) throw new Error();
        return entity;
    });

    const isSelected = createMemo(() => {
        return editorContext.state.selected?.id == props.entityId;
    });

    function expand(): void {
        setExpanded(!isExpanded());
    }

    function isParent(entity: Entity): entity is Parent {
        return "childIds" in entity;
    }

    function onSelect(): void {
        editorContext.setState({
            selected: entityMemo(),
        });
    }

    const childrenMemo = createMemo(() => {
        const entity = entityMemo();
        return isParent(entity)
            ? entity.childIds.map((id) => <EntityNode entityId={id}/>)
            : undefined;
    });

    const icons = {
        [ENTITY_TYPE.MARKER]: {
            label: "marker",
            icon: MarkerIconSvg,
        },
        [ENTITY_TYPE.LAYER]: {
            label: "layer",
            icon: LayerIconSvg,
        },
        [ENTITY_TYPE.TILE]: {
            label: "tile",
            icon: TileIconSvg,
        },
        [ENTITY_TYPE.FOOTNOTE]: {
            label: "footnote",
            icon: FootnoteIconSvg,
        },
    };

    const boop = icons[entityMemo().entityTypeId] || {
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
                    classList={{icon: styles.Icon}}
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
