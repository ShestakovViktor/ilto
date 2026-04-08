import * as styles from "./Viewer.module.scss";
import {JSX, Show, For, on, createMemo, createEffect} from "solid-js";
import {Portal} from "solid-js/web";
import {useViewerContext} from "@src/viewer/context";
import {EntityView} from "@src/viewer/widget";
import {AssetKind} from "@src/core/enum";
import {ConfigOption} from "@src/editor/enum";
import {Parameter} from "@src/storage/type";
import {Layer} from "@src/core/type";
import {Asset} from "@src/core/type";

export function Viewer(): JSX.Element {
    const {storage, viewport, viewer, path} = useViewerContext();

    let viewerRef!: HTMLDivElement;
    let canvasRef!: HTMLDivElement;

    const root = createMemo(on(storage.reloaded, () =>
        storage.data.entity.select<Layer>(1)
    ));

    const keyframes = createMemo(on(storage.reloaded, () => {
        return storage.data.asset
            .filter<Asset>({kind: AssetKind.Keyframe});
    }));

    const width = createMemo(on(storage.reloaded, () => {
        const [widthOption] = storage.data.config
            .filter<Parameter>({name: ConfigOption.Width});
        if (!widthOption) throw new Error();

        return widthOption.number;
    }));

    const height = createMemo(on(storage.reloaded, () => {
        const [heightOption] = storage.data.config
            .filter<Parameter>({name: ConfigOption.Height});

        if (!heightOption) throw new Error();

        return heightOption.number;
    }));

    createEffect(on(storage.reloaded, () => {
        viewport.setFrame(viewerRef);
        viewport.setCanvas(canvasRef);
    }));

    return (
        <div class={styles.Viewer} ref={viewerRef} draggable="false">
            <div
                class={styles.Canvas}
                ref={canvasRef}
                style={{
                    "--scale": viewer.scale,
                    "--x": `${viewer.x}px`,
                    "--y": `${viewer.y}px`,
                    "--w": `${width()}px`,
                    "--h": `${height()}px`,
                }}
            >
                <Show when={root()}>
                    {(root) =>
                        <EntityView entityId={root().id}/>
                    }
                </Show>
            </div>
            <For each={keyframes()}>
                {(keyframe) =>
                    <Portal mount={document.querySelector("head")!}>
                        <link href={path + keyframe.path} rel="stylesheet"/>
                    </Portal>
                }
            </For>
        </div>
    );
}