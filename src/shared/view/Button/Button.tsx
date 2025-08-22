import * as styles from "./Button.module.scss";

import {JSX, Show} from "solid-js";

type Props = {
    label?: string;
    icon?: string;
    pressed?: boolean;
    classList?: Partial<{
        pressed: string;
        button: string;
        icon: string;
        label: string;
    }>;

    onClick?: (event?: MouseEvent) => void;
};

export function Button(props: Props): JSX.Element {
    const {classList} = props;

    return (
        <div
            class={styles.Button}
            classList={{
                [classList?.button ?? ""]: true,
                [classList?.pressed ?? ""]: props.pressed,
            }}
            onClick={props.onClick}
        >
            <Show when={props.icon}>
                <div
                    class={styles.Icon}
                    classList={{[classList?.icon ?? ""]: true}}
                    innerHTML={props.icon}
                    onClick={props.onClick}
                />
            </Show>
            <Show when={props.label}>
                <div
                    class={styles.Label}
                    classList={{[classList?.label ?? ""]: true}}
                >
                    {props.label}
                </div>
            </Show>
        </div>
    );
}