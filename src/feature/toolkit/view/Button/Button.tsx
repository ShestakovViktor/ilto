import {Button as Prototype} from "@shared/view";
import * as styles from "./Button.module.scss";

type Props = {
    label?: string;
    icon?: string;
    pressed?: boolean;
    onClick?: (event?: MouseEvent) => void;
};

export function ToolViewButton(props: Props) {
    const classList = {
        button: styles.Button,
        pressed: styles.Pressed,
        icon: styles.Icon,
        label: styles.Label,
    };

    return (
        <Prototype
            label={props.label}
            icon={props.icon}
            pressed={props.pressed}
            classList={classList}
            onClick={props.onClick}
        />
    );
}