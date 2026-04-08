import * as styles from "./Button.module.scss";

import {JSX, Show} from "solid-js";

type Props = {
    label?: string;
    icon?: string;
    pressed?: boolean;
    type?: "submit";
    form?: string;
    classList?: Partial<{
        Pressed: string;
        Button: string;
        Icon: string;
        Label: string;
    }>;

    onClick?: (event?: MouseEvent) => void;
};

export function Button(props: Props): JSX.Element {
    const {classList} = props;

    return (
        <button
            class={styles.Button}
            classList={{
                [classList?.Button ?? ""]: true,
                [classList?.Pressed ?? ""]: props.pressed,
            }}
            onClick={props.onClick}
            type={props.type}
            form={props.form}
        >
            <Show when={props.icon}>
                <div
                    class={styles.Icon}
                    classList={{[classList?.Icon ?? ""]: true}}
                    innerHTML={props.icon}
                    onClick={props.onClick}
                />
            </Show>
            <Show when={props.label}>
                <div
                    class={styles.Label}
                    classList={{[classList?.Label ?? ""]: true}}
                >
                    {props.label}
                </div>
            </Show>
        </button>
    );
}