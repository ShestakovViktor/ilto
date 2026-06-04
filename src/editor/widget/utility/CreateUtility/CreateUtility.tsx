import * as styles from "./CreateUtility.module.scss";
import MarkerIconSvg from "@res/svg/small/marker.svg";
import ImageIconSvg from "@res/svg/small/image.svg";
import DecorIconSvg from "@res/svg/small/decor.svg";
import PolygonIconSvg from "@res/svg/small/polygon.svg";
import {Widget, Button} from "@src/editor/widget/UtilityBar/widget";
import {For, JSX} from "solid-js";
import {InputMode} from "@src/editor/enum";
import {ScopeProvidor, useEditorContext} from "@src/editor/context";

export function CreateUtility(): JSX.Element {
    const {session, setSession} = useEditorContext();
    const buttons: {icon: string; input: InputMode}[] = [
        {icon: ImageIconSvg, input: InputMode.ImageCreate},
        {icon: MarkerIconSvg, input: InputMode.MarkerCreate},
        {icon: DecorIconSvg, input: InputMode.DecorCreate},
        {icon: PolygonIconSvg, input: InputMode.AreaCreate},
    ];

    return (
        <ScopeProvidor value="CreateEntity">
            <Widget
                title="Create entity"
                class={styles.Widget}
            >
                <For each={buttons}>
                    {(button) =>
                        <Button
                            pressed={session.inputMode == button.input}
                            icon={button.icon}
                            onClick={() => setSession({inputMode: button.input})}
                        />
                    }
                </For>
            </Widget>
        </ScopeProvidor>
    );
}
