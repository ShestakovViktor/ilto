import {JSX} from "solid-js/jsx-runtime";
import * as styles from "./List.module.scss";

type Props = {
    children: string | JSX.Element;
    onClick?: () => void;
};

export function ListItem(props: Props) {
    return (
        <div class={styles.Item} onClick={props.onClick}>
            {props.children}
        </div>
    );
}