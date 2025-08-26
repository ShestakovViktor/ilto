import en from "./string/en.json";
import i18next from "i18next";
import * as styles from "./TextField.module.scss";

import {Field} from "@src/shared/view";
import {Accessor, JSX} from "solid-js";
import {useSharedContext} from "@src/shared/context";
import {Entity} from "@src/entity/type";

i18next.addResourceBundle("en", "entity", {TextField: en}, true, true);

type Props = {
    entity: Accessor<Entity & {text: string}>;
    ref?: HTMLTextAreaElement;
};

export function TextField(props: Props): JSX.Element {
    const {database} = useSharedContext();

    function saveValue(event: Event): void {
        const {value: text} = event.target as HTMLInputElement;
        database.data.entity.update<Entity & {text: string}>(props.entity().id, {text});
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