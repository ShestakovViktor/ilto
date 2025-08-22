import en from "./string/en.json";
import i18next from "i18next";
import * as styles from "./DisplayTool.module.scss";
import ImageIconSvg from "@res/svg/small/image.svg";
import MotionIconSvg from "@res/svg/small/motion.svg";

import {ToolViewButton} from "@feature/toolkit/view";
import {Dialog, Icon, Modal} from "@shared/view";
import {JSX, Show, createMemo} from "solid-js";
import {PropBrowser} from "@feature/asset/view";
import {useStoreContext} from "@feature/store/context";
import {MotionBrowser} from "@feature/asset/view";
import {Entity} from "@feature/entity/type";
import {Motion} from "@feature/asset/type";
import {Prop} from "@feature/asset/type";
import {useViewerContext} from "@feature/viewer/context";
import {useEditorContext} from "@feature/editor/context";

i18next.addResourceBundle("en", "entity", {AppearanceSection: en}, true, true);

export function DisplayTool(): JSX.Element {
    const editorContext = useEditorContext();
    const storeContext = useStoreContext();
    const viewerContext = useViewerContext();

    const entity = createMemo(
        () => editorContext.state.selected || {} as Entity
    );

    const propSrc = createMemo((): string | undefined => {
        const propId = entity().propId;

        if (!propId) return undefined;

        const prop = storeContext.store.asset.select<Prop>(propId);

        if (!prop) return undefined;

        const src = viewerContext.path + prop.path;

        return src;
    });

    const selectedProp = createMemo(() => {
        const propId = entity().propId;
        return propId ? [propId] : [];
    });

    const propBrowserDialog = new Modal();
    propBrowserDialog.render(
        <Dialog
            class={styles.AssetBrowserDialog}
            onClose={() => propBrowserDialog.hide()}
        >
            <PropBrowser
                selected={selectedProp()}
                onSelect={(ids: number[]) => {
                    storeContext.store.entity.update<Entity & {propId: number}>(
                        entity().id,
                        {propId: ids[0]}
                    );
                    propBrowserDialog.hide();
                }}
            />
        </Dialog>
    );

    const motionClass = createMemo((): string | undefined => {
        const motionId = entity().motionId;

        if (!motionId) return undefined;

        const motion = storeContext.store.asset.select<Motion>(motionId);

        if (!motion) return undefined;

        return motion.class;
    });

    const classList = createMemo(() => {
        return {[motionClass() || ""]: Boolean(motionClass())};
    });

    const selectedMotion = createMemo(() => {
        const {motionId} = entity();
        return motionId ? [motionId] : [];
    });

    const motionBrowserDialog = new Modal();
    motionBrowserDialog.render(
        <Dialog
            class={styles.AssetBrowserDialog}
            onClose={() => motionBrowserDialog.hide()}
        >
            <MotionBrowser
                selected={selectedMotion()}
                onSelect={(ids: number[]) => {
                    storeContext.store.entity
                        .update<Entity & {motionId: number}>(
                            entity().id,
                            {motionId: ids[0]}
                        );
                    motionBrowserDialog.hide();
                }}
            />
        </Dialog>
    );

    return (
        <div class={styles.DisplayTool}>
            <div class={styles.Toolbar}>
                <ToolViewButton
                    icon={ImageIconSvg}
                    onClick={() => propBrowserDialog.show()}
                />
                <ToolViewButton
                    icon={MotionIconSvg}
                    onClick={() => motionBrowserDialog.show()}
                />
            </div>

            <Show
                when={propSrc()}
                fallback={(
                    <Icon
                        class={styles.Preview}
                        classList={classList()}
                        svg={ImageIconSvg}
                        // onClick={() => propBrowserDialog.show()}
                    />
                )}
            >
                {<img
                    class={styles.Preview}
                    classList={classList()}
                    src={propSrc()}
                    draggable={false}
                    onPointerDown={() => propBrowserDialog.show()}
                />}
            </Show>
        </div>
    );
}