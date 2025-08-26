import * as styles from "./CreateUtility.module.scss";
import LoupeIconSvg from "@res/svg/small/loupe.svg";
import CursorIconSvg from "@res/svg/small/cursor.svg";
import MarkerIconSvg from "@res/svg/small/marker.svg";
import DecorIconSvg from "@res/svg/small/decor.svg";
import PolygonIconSvg from "@res/svg/small/polygon.svg";

import {Button} from "@src/editor/widget/UtilityBar/widget";
import {createSignal, For, JSX, onMount} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {INPUT_MODE} from "@src/editor/enum";
import {useViewerContext} from "@src/viewer/context";
import {VIEWER_MODE} from "@src/viewer/enum";
import {
    Widget,
} from "@src/editor/widget/UtilityBar/widget/Widget";

export function CreateUtility(): JSX.Element {
    const editorContext = useEditorContext();
    const viewerContext = useViewerContext();
    const [pressed, setPressed] = createSignal(0);

    const buttons = [
        {
            icon: LoupeIconSvg,
            onClick(): void {
                editorContext.setSession({
                    selected: undefined,
                    inputMode: INPUT_MODE.DEFAULT_VIEW,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.PRODUCTION});
            },
        },
        {
            icon: CursorIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: INPUT_MODE.ETITY_SELECT,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: MarkerIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: INPUT_MODE.MARKER_CREATE,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: DecorIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: INPUT_MODE.DECOR_CREATE,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});

            },
        },
        {
            icon: PolygonIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: INPUT_MODE.AREA_CREATE,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },

    ];

    onMount(() => {
        buttons[0].onClick();
    });

    return (
        <Widget
            title="Create entity"
            class={styles.Widget}
            uid={"efjw"}
        >
            <For each={buttons}>
                {(button, index) =>
                    <Button
                        pressed={pressed() == index()}
                        icon={button.icon}
                        onClick={() => {
                            setPressed(index());
                            button.onClick();
                        }}
                    />
                }
            </For>
        </Widget>
    );
}