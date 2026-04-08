import {JSX} from "solid-js";
import * as styles from "./Icon.module.scss";

type Props = {
    class?: string;
    classList?: {[key: string]: boolean | undefined};
    svg: string;
    onClick?: (event?: MouseEvent) => void;
};

export function Icon(props: Props): JSX.Element {
    return (
        <div
            class={`${styles.Icon} ${props.class || ""}`}
            classList={props.classList}
            innerHTML={props.svg}
            onClick={props.onClick}
        />
    );
}