import * as styles from "./Dialog.module.scss";
import SaltireIconSvg from "@res/svg/small/saltire.svg";
import {Button} from "@src/core/widget";

import {JSX, onMount} from "solid-js";

type Props = {
    children?: JSX.Element | JSX.Element[];
    title?: string;
    classList?: Partial<{
        Dialog: string;
        Header: string;
        Body: string;
        Button: string;
        Icon: string;
    }>;
    onOpen?: () => void;
    onClose?: () => void;
    onSubmit?: () => void;
};

const cn = (...classes: (string | undefined)[]) => classes
    .filter(Boolean).join(" ");

export function Dialog(props: Props): JSX.Element {
    onMount(() => props.onOpen?.());

    return (
        <dialog
            class={cn(styles.Dialog, props.classList?.Dialog)}
            onSubmit={props.onSubmit}
        >
            <div class={cn(styles.Header, props.classList?.Header)}>
                <div>{props.title}</div>
                <Button
                    icon={SaltireIconSvg}
                    onClick={props.onClose}
                    classList={{
                        Button: props.classList?.Button,
                        Icon: props.classList?.Icon,
                    }}
                />
            </div>
            <div
                class={cn(styles.Body, props.classList?.Body)}
                classList={{[props.classList?.Body ?? ""]: true}}
            >
                {props.children}
            </div>
        </dialog>
    );
}