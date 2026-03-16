import * as styles from "./Viewer.module.scss";
import {JSX, Show, For, on, createMemo, createEffect} from "solid-js";
import {Portal} from "solid-js/web";
import {useViewerContext} from "@src/viewer/context";
import {useSharedContext} from "@src/shared/context";
import {EntityView} from "@src/entity/widget";
import {AssetKind} from "@src/asset/enum";
import {ConfigOption} from "@src/editor/enum";
import {Parameter} from "@src/shared/type";
import {Layer} from "@src/entity/type";
import {Asset} from "@src/asset/type";

export function Viewer(): JSX.Element {
    const {database} = useSharedContext();
    const {viewManager, path} = useViewerContext();

    let viewerRef!: HTMLDivElement;
    let canvasRef!: HTMLDivElement;

    const root = createMemo(on(database.reloaded, () =>
        database.data.entity.select<Layer>(1)
    ));

    const keyframes = createMemo(on(database.reloaded, () => {
        return database.data.asset
            .filter<Asset>({kind: AssetKind.Keyframe});
    }));

    const style = createMemo(on(database.reloaded, () => {
        const [widthOption] = database.data.config
            .filter<Parameter>({name: ConfigOption.Width});

        const [heightOption] = database.data.config
            .filter<Parameter>({name: ConfigOption.Height});

        if (!widthOption || !heightOption) throw new Error();

        return {
            width: widthOption.number + "px",
            height: heightOption.number + "px",
        };
    }));

    createEffect(on(database.reloaded, () => {
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