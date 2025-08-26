import * as styles from "./List.module.scss";
import {children, JSX} from "solid-js";

type Props = {
    children: JSX.Element | JSX.Element[];
};

export function List(props: Props) {
    const childs = children(() => props.children);

    return (
        <div class={styles.List}>
            {childs()}
        </div>
    );
}