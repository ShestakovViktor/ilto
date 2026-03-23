import * as styles from "./CreateUtility.module.scss";
import LoupeIconSvg from "@res/svg/small/loupe.svg";
import CursorIconSvg from "@res/svg/small/cursor.svg";
import MarkerIconSvg from "@res/svg/small/marker.svg";
import DecorIconSvg from "@res/svg/small/decor.svg";
import PolygonIconSvg from "@res/svg/small/polygon.svg";
import ImageIconSvg from "@res/svg/small/image.svg";
import {Button} from "@src/editor/widget/UtilityBar/widget";
import {createSignal, For, JSX, onMount} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {InputMode} from "@src/editor/enum";
import {useViewerContext} from "@src/viewer/context";
import {VIEWER_MODE} from "@src/viewer/enum";
import {
    Widget,
} from "@src/editor/widget/UtilityBar/widget/Widget";

type Props = {
    uid: string;
};

export function CreateUtility(props: Props): JSX.Element {
    const editorContext = useEditorContext();
    const viewerContext = useViewerContext();
    const [pressed, setPressed] = createSignal(0);

    const buttons = [
        {
            icon: LoupeIconSvg,
            onClick(): void {
                editorContext.setSession({
                    selected: undefined,
                    inputMode: InputMode.DefaultView,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.PRODUCTION});
            },
        },
        {
            icon: CursorIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: InputMode.EntitySelect,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: ImageIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: InputMode.ImageCreate,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: MarkerIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: InputMode.MarkerCreate,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});
            },
        },
        {
            icon: DecorIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: InputMode.DecorCreate,
                });

                viewerContext.setViewer({mode: VIEWER_MODE.DEVELOPMENT});

            },
        },
        {
            icon: PolygonIconSvg,
            onClick(): void {
                editorContext.setSession({
                    inputMode: InputMode.AreaCreate,
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
            uid={props.uid}
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