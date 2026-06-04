import en from "./string/en.json";
import i18next from "i18next";
import * as styles from "./DisplayUtility.module.scss";
import ImageIconSvg from "@res/svg/small/image.svg";
// import MotionIconSvg from "@res/svg/small/motion.svg";

import {/*Dialog,*/ Icon, Modal} from "@src/core/widget";
import {JSX, Show, createMemo} from "solid-js";
// import {MotionBrowser} from "@src/editor/widget";
import {Entity, Visual} from "@src/core/type";
// import {Prop, Motion} from "@src/core/type";
import {useViewerContext} from "@src/viewer/context";
import {ScopeProvidor, useEditorContext} from "@src/editor/context";
import {Section, Widget} from "@src/editor/widget/UtilityBar/widget";
import {PropBrowser} from "@src/editor/widget";

i18next.addResourceBundle("en", "entity", {AppearanceSection: en}, true, true);

export function DisplayUtility(): JSX.Element {
    const {storage, session} = useEditorContext();
    const {path} = useViewerContext();

    const entityMemo = createMemo(
        () => session.selected || {} as Entity
    );

    function isVisual(entity: Entity | Visual): entity is Visual {
        return "propId" in entity;
    }

    const propSrc = createMemo((): string | undefined => {
        const entity = entityMemo();

        if (!isVisual(entity)) return undefined;

        const propId = "propId" in entity ? entity.propId : undefined;

        if (!propId) return undefined;

        const prop = storage.data.asset.select(propId);

        if (!prop) return undefined;

        const src = path + prop.path;

        return src;
    });

    // const selectedProp = createMemo(() => {
    //     const propId = entityMemo().propId;
    //     return propId ? [propId] : [];
    // });

    const propBrowserDialog = new Modal();
    propBrowserDialog.render(
        <PropBrowser
            // selected={selectedProp()}
            onSelect={(ids: number[]) => {
                storage.data.entity
                    .update<Entity & {propId: number}>(
                        entityMemo().id,
                        {propId: ids[0]}
                    );
                propBrowserDialog.hide();
            }}
        />
    );

    // const motionClass = createMemo((): string | undefined => {
    //     const motionId = entityMemo().motionId;

    //     if (!motionId) return undefined;

    //     const motion = storage.data.asset
    //         .select<Motion>(motionId);

    //     if (!motion) return undefined;

    //     return motion.class;
    // });

    // const classList = createMemo(() => {
    //     return {[motionClass() || ""]: Boolean(motionClass())};
    // });

    // const selectedMotion = createMemo(() => {
    //     const {motionId} = entityMemo();
    //     return motionId ? [motionId] : [];
    // });

    // const motionBrowserDialog = new Modal();
    // motionBrowserDialog.render(
    //     <Dialog
    //         class={styles.AssetBrowserDialog}
    //         onClose={() => motionBrowserDialog.hide()}
    //     >
    //         <MotionBrowser
    //             selected={selectedMotion()}
    //             onSelect={(ids: number[]) => {
    //                 storage.data.entity
    //                     .update<Entity & {motionId: number}>(
    //                         entityMemo().id,
    //                         {motionId: ids[0]}
    //                     );
    //                 motionBrowserDialog.hide();
    //             }}
    //         />
    //     </Dialog>
    // );

    return (
        <ScopeProvidor value="DisplayUtility">

            <Widget
                class={styles.DisplayUtility}
                title="Display"
            >
                <Show when={isVisual(entityMemo())}>
                    <ScopeProvidor value="PropSection">
                        <Section title="Prop">
                            <Show
                                when={propSrc()}
                                fallback={(
                                    <Icon
                                        class={styles.Preview}
                                        //classList={classList()}
                                        svg={ImageIconSvg}
                                        onClick={() => propBrowserDialog.show()}
                                    />
                                )}
                            >
                                <img
                                    class={styles.Preview}
                                    src={propSrc()}
                                    draggable={false}
                                    onPointerDown={() => {
                                        propBrowserDialog.show();
                                    }}
                                />
                            </Show>
                        </Section>
                    </ScopeProvidor>
                </Show>
                {/* <div class={styles.Toolbar}>
                <Button
                    icon={ImageIconSvg}
                    onClick={() => propBrowserDialog.show()}
                />
                <Button
                    icon={MotionIconSvg}
                    onClick={() => motionBrowserDialog.show()}
                />
            </div>

             */}

            </Widget>
        </ScopeProvidor>
    );
}