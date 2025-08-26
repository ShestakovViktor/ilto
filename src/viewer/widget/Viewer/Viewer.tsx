import * as styles from "./Viewer.module.scss";
import {JSX, Show, For, on, createMemo, createEffect} from "solid-js";
import {Portal} from "solid-js/web";
import {useViewerContext} from "@src/viewer/context";
import {useSharedContext} from "@src/shared/context";
import {EntityView} from "@src/entity/widget";
import {ASSET_TYPE} from "@src/asset/enum";
import {CONFIG_OPTION} from "@src/editor/enum";
import {Parameter, Type} from "@src/shared/type";
import {Motion} from "@src/asset/type";
import {Layer} from "@src/entity/type";

export function Viewer(): JSX.Element {
    const {database} = useSharedContext();
    const {viewManager, path} = useViewerContext();

    let viewerRef!: HTMLDivElement;
    let canvasRef!: HTMLDivElement;

    const root = createMemo(on(database.reloaded, () =>
        database.data.entity.select<Layer>(1)
    ));

    const motions = createMemo(on(database.reloaded, () => {
        const [motionType] = database.data.assetType
            .filter<Type>({name: ASSET_TYPE.MOTION});

        if (!motionType) throw new Error();

        return database.data.asset
            .filter<Motion>({assetTypeId: ASSET_TYPE.MOTION});
    }));

    const style = createMemo(on(database.reloaded, () => {
        const [widthOption] = database.data.config
            .filter<Parameter>({name: CONFIG_OPTION.WIDTH});

        const [heightOption] = database.data.config
            .filter<Parameter>({name: CONFIG_OPTION.HEIGHT});

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
            <For each={motions()}>
                {(motion) =>
                    <Portal mount={document.querySelector("head")!}>
                        <link href={path + motion.path} rel="stylesheet"/>
                    </Portal>
                }
            </For>
        </div>
    );
}