import en from "./string/en.json";
import i18next from "i18next";
import * as styles from "./TextField.module.scss";

import {Field} from "@src/utility/view";
import {Accessor, JSX} from "solid-js";
import {Entity} from "@src/entity/type";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "entity", {TextField: en}, true, true);

type Props = {
    entity: Accessor<Entity & {text: string}>;
    ref?: HTMLTextAreaElement;
};

export function TextField(props: Props): JSX.Element {
    const {storage} = useEditorContext();

    function saveValue(event: Event): void {
        const {value: text} = event.target as HTMLInputElement;
        storage.data.entity.update<Entity & {text: string}>(props.entity().id, {text});
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