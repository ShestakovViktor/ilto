import * as styles from "./Viewer.module.scss";
import {JSX, Show, For, on, createMemo, createEffect} from "solid-js";
import {Portal} from "solid-js/web";
import {useViewerContext} from "@src/viewer/context";
import {EntityView} from "@src/viewer/widget";
import {AssetKind} from "@src/asset/enum";
import {ConfigOption} from "@src/editor/enum";
import {Parameter} from "@src/storage/type";
import {Layer} from "@src/entity/type";
import {Asset} from "@src/asset/type";

export function Viewer(): JSX.Element {
    const {storage, viewManager, path} = useViewerContext();

    let viewerRef!: HTMLDivElement;
    let canvasRef!: HTMLDivElement;

    const root = createMemo(on(storage.reloaded, () =>
        storage.data.entity.select<Layer>(1)
    ));

    const keyframes = createMemo(on(storage.reloaded, () => {
        return storage.data.asset
            .filter<Asset>({kind: AssetKind.Keyframe});
    }));

    const style = createMemo(on(storage.reloaded, () => {
        const [widthOption] = storage.data.config
            .filter<Parameter>({name: ConfigOption.Width});

        const [heightOption] = storage.data.config
            .filter<Parameter>({name: ConfigOption.Height});

        if (!widthOption || !heightOption) throw new Error();

        return {
            width: widthOption.number + "px",
            height: heightOption.number + "px",
        };
    }));

    createEffect(on(storage.reloaded, () => {
        viewManager.setFrame(viewerRef);
        viewManager.setCanvas(canvasRef);
    }));

    return (
        <div class={styles.Viewer} ref={viewerRef} draggable="false">
            <div class={styles.Canvas} ref={canvasRef} style={style()}>
                <Show when={root()}>{root =>
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