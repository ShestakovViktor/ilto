import * as styles from "./Accordion.module.scss";
import {JSX} from "solid-js";
import {Accordion as Proto} from "@shared/view";

type Props = {
    children: JSX.Element | JSX.Element[];
};

export function Accordion(props: Props) {
    const classList = {
        accordion: styles.Accordion,
        header: styles.Header,
        title: styles.Title,
        section: styles.Section,
        content: styles.Content,
    };

    return (
        <Proto classList={classList}>
            {props.children}
        </Proto>
    );
}