import * as styles from "./Viewer.module.scss";
import {JSX, createMemo, Show, For, Ref} from "solid-js";
import {Portal} from "solid-js/web";

import {useViewerContext} from "@feature/viewer/context";
import {Viewport} from "@feature/viewer/controller";
import {EntityView} from "@feature/entity/view";
import {useStoreContext} from "@feature/store/context";
import {ASSET_TYPE} from "@feature/asset/enum";

type Props = {
    ref?: Ref<HTMLDivElement>;
};

export function Viewer(props: Props = {ref: undefined}): JSX.Element {
    const storeContext = useStoreContext();
    const viewerContext = useViewerContext();

    const root = createMemo(() => {
        return storeContext.store.entity.select(1);
    });

    const motions = createMemo(() => {
        return storeContext.store.asset
            .selectByParams({assetTypeId: ASSET_TYPE.MOTION});
    });

    function onViewerMount(viewer: HTMLDivElement): void {
        viewerContext.viewport = new Viewport(viewer);
        if (typeof props.ref == "function") props.ref(viewer);
    }

    return (
        <div
            class={styles.Viewer}
            ref={onViewerMount}
            draggable="false"
        >
            <For each={motions()}>
                {(motion) => {
                    const href = viewerContext.path + motion.path;

                    return (
                        <Portal mount={document.querySelector("head")!}>
                            <link href={href} rel="stylesheet"/>
                        </Portal>
                    );
                }}
            </For>

            <Show when={root()}>
                {(root) => <EntityView entityId={root().id}/>}
            </Show>
        </div>
    );
}