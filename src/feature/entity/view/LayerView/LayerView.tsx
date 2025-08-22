import {Accessor, createMemo, For, JSX} from "solid-js";
import * as styles from "./LayerView.module.scss";
import {EntityView} from "@feature/entity/view";
import {useViewerContext} from "@feature/viewer/context";
import {Layer} from "@feature/entity/type";
import {DISPLAY_OPTION} from "@feature/entity/enum";

type Props = {
    entity: Accessor<Layer>;
};

export function LayerView(props: Props): JSX.Element {
    const {entity} = props;
    const viewerContext = useViewerContext();

    const transform = createMemo((): string => {
        if (entity().displayOptionIds.includes(DISPLAY_OPTION.MOVABLE)) {
            const x = entity().x || 0 + viewerContext.state.x;
            const y = entity().y || 0 + viewerContext.state.y;
            return `translate3d(${x}px, ${y}px, 0px)`;
        }
        else if (entity().displayOptionIds.includes(DISPLAY_OPTION.SCALABLE)) {
            return `scale(${viewerContext.state.scale})`;
        }
        else {
            return "";
        }
    });

    return (
        <div
            class={styles.Layer}
            data-entity-id={entity().id}
            style={{transform: transform()}}
        >
            <For each={entity().childIds}>
                {id => <EntityView entityId={id}/>}
            </For>
        </div>
    );
}