import {JSX} from "solid-js";
import * as styles from "./Field.module.scss";

type Props = {
    label: string;
    name: string;
    type: string;
    value?: string;
    accept?: string;
    step?: string;
    readonly?: boolean;
    required?: boolean;
    onKeyDown?: () => void;
    onChange?: () => void;
};

export function Field(props: Props): JSX.Element {
    return (
        <div class={styles.Field}>
            <label
                class={styles.Label}
                for={props.name}
            >
                {props.label}
            </label>
            <input
                class={styles.Input}
                type={props.type}
                name={props.name}
                // value={props.value || undefined}
                step={props.step}
                onKeyDown={props.onKeyDown}
                onChange={props.onChange}
                readonly={props.readonly}
                required={props.required}
            />
        </div>
    );
}