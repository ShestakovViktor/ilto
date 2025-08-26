import * as styles from "./DecorView.module.scss";
import ImageIconSvg from "@res/svg/small/image.svg";
import {Accessor, JSX, Show, createMemo} from "solid-js";
import {useViewerContext} from "@src/viewer/context";

import {useSharedContext} from "@src/shared/context";
import {Icon} from "@src/shared/view";
import {Decor} from "@src/entity/type";
import {Motion} from "@src/asset/type";
import {Prop} from "@src/asset/type";

type Props = {
    entity: Accessor<Decor>;
};

export function DecorView(props: Props): JSX.Element {
    const {database} = useSharedContext();
    const viewerContext = useViewerContext();

    const transform = createMemo((): string => {
        const x = props.entity().x * viewerContext.viewer.scale;
        const y = props.entity().y * viewerContext.viewer.scale;

        return `translate3d(${x}px, ${y}px, 0px)`;
    });

    const propSrc = createMemo((): string | undefined => {
        const propId = props.entity().propId;

        if (!propId) return undefined;

        const prop = database.data.asset.select<Prop>(propId);

        if (!prop) return undefined;

        const src = viewerContext.path + prop.path;

        return src;
    });

    const motionClass = createMemo((): string | undefined => {
        const motionId = props.entity().motionId;

        if (!motionId) return undefined;

        const motion = database.data.asset.select<Motion>(motionId);

        if (!motion) return undefined;

        return motion.class;
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