import en from "./string/en.json";
import i18next from "i18next";
import styles from "./TextField.module.scss";

import {Field} from "@shared/widget";
import {Accessor, JSX} from "solid-js";
import {useStoreContext} from "@feature/store/context";
import {Entity} from "@feature/entity/type";

i18next.addResourceBundle("en", "entity", {TextField: en}, true, true);

type Props = {
    entity: Accessor<Entity & {text: string}>;
    ref?: HTMLTextAreaElement;
};

export function TextField(props: Props): JSX.Element {
    const {store} = useStoreContext();

    function saveValue(event: Event): void {
        const {value: text} = event.target as HTMLInputElement;
        store.entity.set<Entity & {text: string}>(props.entity().id, {text});
    }

    return (
        <Field class={styles.TextField} column>
            <label for="text">
                {i18next.t(
                    "entity:TextField.label",
                    {postProcess: ["capitalize"]}
                )}
            </label>
            <textarea
                id="text"
                name="text"
                ref={props.ref}
                data-tipe="string"
                value={props.entity().text}
                onBlur={saveValue}
            />
        </Field>
    );
}