import styles from "./ModalLayer.module.scss";
import {JSX} from "solid-js";

type Props = {
    children?: JSX.Element;
};

export function ModalLayer(props: Props): JSX.Element {
    return (
        <div id={"modal"} class={styles.ModalLayer}>
            <div>
                {props.children}
            </div>
        </div>
    );
}