import en from "./string/en.json";
import i18next from "i18next";

import {Field, Input} from "@src/utility/view";
import {createMemo, JSX} from "solid-js";
import {Parameter} from "@src/storage/type";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "project", {MaxScaleField: en}, true, true);

export function MaxScaleField(): JSX.Element {
    const {storage} = useEditorContext();

    const maxScale = createMemo(
        () => storage.data.config.selectByParams<Parameter>({name: "maxScale"})[0]
    );

    function handleChange (event: Event): void {
        const target = event.target as HTMLInputElement;
        storage.data.config.update<Parameter>(
            maxScale().id,
            {value: Number(target.value)}
        );
    }

    return (
        <Field>
            <label for="maxScale">
                {i18next.t(
                    "project:MaxScaleField.label",
                    {postProcess: ["capitalize"]}
                )}
            </label>
            <Input
                type="number"
                name="maxScale"
                step="0.1"
                // min="0"
                // max="10"
                value={String(maxScale().value)}
                onChange={handleChange}
            />
        </Field>
    );
}