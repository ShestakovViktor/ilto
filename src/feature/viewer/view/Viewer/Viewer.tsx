import styles from "./Viewer.module.scss";
import {JSX, createMemo, Show, For, Ref} from "solid-js";
import {Portal} from "solid-js/web";

import {useViewerContext} from "@feature/viewer/context";
import {Viewport} from "@feature/viewer/controller";
import {EntityView} from "@feature/entity/view";
import {IDS} from "@enum";
import {useStoreContext} from "@feature/store/context";
import {ASSET_TYPE} from "@feature/asset/enum";

type Props = {
    ref?: Ref<HTMLDivElement>;
};

export function Viewer(props: Props = {ref: undefined}): JSX.Element {
    const storeCtx = useStoreContext();
    const viewerCtx = useViewerContext();

    const root = createMemo(() => {
        return storeCtx.store.entity.getById(1);
    });

    const motions = createMemo(() => {
        return storeCtx.store.asset
            .getByParams({assetTypeId: ASSET_TYPE.MOTION});
    });

    function onViewerMount(viewer: HTMLDivElement): void {
        viewerCtx.viewport = new Viewport(viewer);
        if (typeof props.ref == "function") props.ref(viewer);
    }

    return (
        <div
            id={IDS.VIEWER}
            class={styles.Viewer}
            ref={onViewerMount}
            draggable="false"
        >
            <For each={motions()}>
                {(motion) => {
                    const href = viewerCtx.path + motion.path;

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