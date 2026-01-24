import en from "./string/en.json";
import i18next from "i18next";
import * as styles from "./DisplayUtility.module.scss";
import ImageIconSvg from "@res/svg/small/image.svg";
// import MotionIconSvg from "@res/svg/small/motion.svg";

import {/*Dialog,*/ Icon, Modal} from "@src/shared/view";
import {JSX, Show, createMemo} from "solid-js";
// import {MotionBrowser} from "@src/asset/widget";
import {Entity, Visual} from "@src/entity/type";
// import {Prop, Motion} from "@src/asset/type";
import {Prop} from "@src/asset/type";
import {useViewerContext} from "@src/viewer/context";
import {useEditorContext} from "@src/editor/context";
import {useSharedContext} from "@src/shared/context";
import {Section, Widget} from "@src/editor/widget/UtilityBar/widget";
import {PropBrowser} from "@src/asset/widget";

i18next.addResourceBundle("en", "entity", {AppearanceSection: en}, true, true);

export function DisplayUtility(): JSX.Element {
    const {session} = useEditorContext();
    const {database} = useSharedContext();
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

        const prop = database.data.asset.select<Prop>(propId);

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
                database.data.entity
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

    //     const motion = database.data.asset
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
    //                 database.data.entity
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
        <Widget
            class={styles.DisplayUtility}
            uid="cqsa"
            title="Display"
        >
            <Show when={isVisual(entityMemo())}>
                <Section uid="mwem" title="Prop">
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
    );
}