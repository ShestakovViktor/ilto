import * as styles from "./Dialog.module.scss";
import {JSX} from "solid-js";
import {Dialog as UnstyledDialog} from "@src/core/widget";

type Props = {
    children?: JSX.Element | JSX.Element[];
    title?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onSubmit?: () => void;
};

export function Dialog(props: Props) {
    const classList = {
        Dialog: styles.Dialog,
        Header: styles.Header,
        Body: styles.Body,
        Button: styles.Button,
        Icon: styles.Icon,
    };

    return (
        <UnstyledDialog
            classList={classList}
            title={props.title}
            onClose={props.onClose}
            onOpen={props.onOpen}
            onSubmit={props.onSubmit}
        >
            {props.children}
        </UnstyledDialog>
    );
}