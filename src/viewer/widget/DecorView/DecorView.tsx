import * as styles from "./DecorView.module.scss";
import ImageIconSvg from "@res/svg/small/image.svg";
import {Accessor, JSX, Show, createMemo} from "solid-js";
import {useViewerContext} from "@src/viewer/context";

import {Icon} from "@src/core/widget";
import {Decor} from "@src/core/type";
import {Asset} from "@src/core/type";

type Props = {
    entity: Accessor<Decor>;
};

export function DecorView(props: Props): JSX.Element {
    const {viewer, storage, path} = useViewerContext();

    const transform = createMemo((): string => {
        const x = props.entity().x * viewer.scale;
        const y = props.entity().y * viewer.scale;

        return `translate3d(${x}px, ${y}px, 0px)`;
    });

    const propSrc = createMemo((): string | undefined => {
        const propId = props.entity().propId;

        if (!propId) return undefined;

        const prop = storage.data.asset.select<Asset>(propId);

        if (!prop) return undefined;

        const src = path + prop.path;

        return src;
    });

    const motionClass = createMemo((): string | undefined => {
        const motionId = props.entity().motionId;

        if (!motionId) return undefined;

        const motion = storage.data.asset.select<Asset>(motionId);

        if (!motion) return undefined;

        return "REPLACE ME";
    });

    const classList = createMemo(() => {
        return {[motionClass() || ""]: Boolean(motionClass())};
    });

    return (
        <div
            class={styles.DecorView}
            style={{transform: transform()}}
            data-entity-id={props.entity().id}
        >
            <div class={styles.Decor}>
                <Show
                    when={propSrc()}
                    fallback={(
                        <Icon
                            svg={ImageIconSvg}
                            classList={classList()}
                        />
                    )}
                >
                    {<img
                        classList={classList()}
                        src={propSrc()}
                        draggable={false}
                    />}
                </Show>
            </div>
        </div>
    );
}