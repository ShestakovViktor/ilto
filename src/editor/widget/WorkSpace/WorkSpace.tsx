import {JSX} from "solid-js";
import {useEditorContext} from "@src/editor/context";

type Props = {
    children: JSX.Element;
};

export function WorkSpace(props: Props): JSX.Element {
    const {input} = useEditorContext();
    // hotkey.setElement(workspace);

    return (
        <div
            tabIndex={0}
            ref={(el) => {
                el.addEventListener(
                    "mousedown",
                    (event) => input.active.onMouseDown(event),
                    {capture: true}
                );
                el.addEventListener(
                    "mousemove",
                    (event) => input.active.onMouseMove(event),
                    {capture: true}
                );
                el.addEventListener(
                    "mouseup",
                    (event) => input.active.onMouseUp(event),
                    {capture: true}
                );
            }}
        >
            {props.children}
        </div>
    );
}
