import * as styles from "./Field.module.scss";
import {JSX} from "solid-js";

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
    classList?: Partial<{
        Field: string;
        Label: string;
        Input: string;
    }>;
};

export function Field(props: Props): JSX.Element {
    return (
        <div class={`${styles.Field} ${props.classList?.Field}`}>
            <label
                class={`${styles.Label} ${props.classList?.Label}`}
                for={props.name}
            >
                {props.label}
            </label>
            <input
                class={`${styles.Input} ${props.classList?.Input}`}
                type={props.type}
                name={props.name}
                step={props.step}
                onKeyDown={props.onKeyDown}
                onChange={props.onChange}
                readonly={props.readonly}
                required={props.required}

                {...(props.type !== "file" && {value: props.value})}
            />
        </div>
    );
}