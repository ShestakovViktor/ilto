import {JSX, Show} from "solid-js";
import {Portal as SolidPortal} from "solid-js/web";

type Props = {
    show: boolean;
    destination: string;
    children: JSX.Element;
};

export function Portal(props: Props): JSX.Element {
    return (
        <Show when={props.show}>
            <SolidPortal mount={document.querySelector(props.destination)!}>
                {props.children}
            </SolidPortal>
        </Show>
    );
}