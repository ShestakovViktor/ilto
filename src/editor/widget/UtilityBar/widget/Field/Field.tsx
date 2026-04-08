import {JSX} from "solid-js";
import * as styles from "./Field.module.scss";
import {Field as UnstlyledField} from "@src/core/widget";

type Props = {
    label: string;
    name: string;
    type?: string;
    value?: string;
    accept?: string;
    step?: string;
    readonly?: boolean;
    required?: boolean;
    onKeyDown?: (event: KeyboardEvent) => void;
    onChange?: (event: Event) => void;
};

export function Field(props: Props): JSX.Element {
    const classList = {
        Field: styles.Field,
        Label: styles.Label,
        Input: styles.Input,
    };

    return (
        <UnstlyledField
            classList={classList}
            label={props.label}
            name={props.name}
            type={props.type}
            value={props.value}
            accept={props.accept}
            step={props.step}
            readonly={props.readonly}
            required={props.required}
            onKeyDown={props.onKeyDown}
            onChange={props.onChange}
        />
    );
}