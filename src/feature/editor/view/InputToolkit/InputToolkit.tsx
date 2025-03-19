import styles from "./InputToolkit.module.scss";
import LoupeIconSvg from "@res/svg/loupe.svg";
import CursorIconSvg from "@res/svg/cursor.svg";
import MarkerIconSvg from "@res/svg/marker.svg";
import DecorIconSvg from "@res/svg/decor.svg";
import PolygonIconSvg from "@res/svg/polygon.svg";

import {Button, Toolbar} from "@shared/view";
import {For, JSX, createSignal, onMount} from "solid-js";
import {useEditorContext} from "@feature/editor/context";
import {INPUT_MODE, UI_MODE} from "@feature/editor/enum";
import {useViewerContext} from "@feature/viewer/context";
import {VIEWER_MODE} from "@feature/viewer/enum";

export function InputToolkit(): JSX.Element {
    const editorContext = useEditorContext();
    const viewerContext = useViewerContext();
    const [pressed, setPressed] = createSignal(0);

    const buttons = [
        {
            icon: LoupeIconSvg,
            onClick(): void {
                editorContext.setSelected(undefined);

                editorContext.setState({
                    dockArea: {items: []},
                    inputMode: INPUT_MODE.DEFAULT_VIEW,
                });

                viewerContext.setState({mode: VIEWER_MODE.PRODUCTION});
            },
        },
        {
            icon: CursorIconSvg,
            onClick(): void {
                editorContext.setState({
                    dockArea: {items: []},
                    inputMode: INPUT_MODE.ETITY_SELECT,
                });

                viewerContext.setState({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: MarkerIconSvg,
            onClick(): void {
                editorContext.setState({
                    dockArea: {items: [UI_MODE.ENTITY_FORM]},
                    inputMode: INPUT_MODE.MARKER_CREATE,
                });

                viewerContext.setState({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: DecorIconSvg,
            onClick(): void {
                editorContext.setState({
                    dockArea: {items: [UI_MODE.ENTITY_FORM]},
                    inputMode: INPUT_MODE.DECOR_CREATE,
                });

                viewerContext.setState({mode: VIEWER_MODE.DEVELOPMENT});

            },
        },
        {
            icon: PolygonIconSvg,
            onClick(): void {
                editorContext.setState({
                    dockArea: {items: [UI_MODE.ENTITY_FORM]},
                    inputMode: INPUT_MODE.AREA_CREATE,
                });

                viewerContext.setState({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },

    ];

    onMount(() => {
        buttons[0].onClick();
    });

    return (
        <Toolbar class={styles.InputToolkit}>
            <For each={buttons}>
                {(button, index) =>
                    <Button
                        pressed={pressed() == index()
                            ? styles.Pressed
                            : undefined
                        }
                        icon={button.icon}
                        onClick={() => {
                            setPressed(index());
                            button.onClick();
                        }}
                    />
                }
            </For>
        </Toolbar>
    );
}