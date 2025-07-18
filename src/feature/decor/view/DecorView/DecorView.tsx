import * as styles from "./DecorView.module.scss";
import ImageIconSvg from "@res/svg/image.svg";
import {Accessor, JSX, Show, createMemo} from "solid-js";
import {useViewerContext} from "@feature/viewer/context";

import {useStoreContext} from "@feature/store/context";
import {Icon} from "@shared/view";
import {Decor} from "@feature/decor/type";
import {Motion} from "@feature/motion/type";
import {Prop} from "@feature/prop/type";

type Props = {
    entity: Accessor<Decor>;
};

export function DecorView(props: Props): JSX.Element {
    const {store} = useStoreContext();
    const viewerContext = useViewerContext();

    const transform = createMemo((): string => {
        const x = props.entity().x * viewerContext.state.scale;
        const y = props.entity().y * viewerContext.state.scale;

        return `translate3d(${x}px, ${y}px, 0px)`;
    });

    const propSrc = createMemo((): string | undefined => {
        const propId = props.entity().propId;

        if (!propId) return undefined;

        const prop = store.asset.getById<Prop>(propId);

        if (!prop) return undefined;

        const src = viewerContext.path + prop.path;

        return src;
    });

    const motionClass = createMemo((): string | undefined => {
        const motionId = props.entity().motionId;

        if (!motionId) return undefined;

        const motion = store.asset.getById<Motion>(motionId);

        if (!motion) return undefined;

        return motion.class;
    });

    const classList = createMemo(() => {
        return {[motionClass() || ""]:  Boolean(motionClass())};
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