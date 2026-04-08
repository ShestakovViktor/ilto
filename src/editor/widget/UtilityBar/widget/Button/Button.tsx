import {Button as UnstyledButton} from "@src/core/widget";
import * as styles from "./Button.module.scss";

type Props = {
    label?: string;
    icon?: string;
    pressed?: boolean;
    onClick?: (event?: MouseEvent) => void;
};

export function Button(props: Props) {
    const classList = {
        Button: styles.Button,
        Pressed: styles.Pressed,
        Icon: styles.Icon,
        Label: styles.Label,
    };

    return (
        <UnstyledButton
            label={props.label}
            icon={props.icon}
            pressed={props.pressed}
            classList={classList}
            onClick={props.onClick}
        />
    );
}