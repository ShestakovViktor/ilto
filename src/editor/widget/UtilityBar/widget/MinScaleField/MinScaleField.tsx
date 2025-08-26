import en from "./string/en.json";
import i18next from "i18next";

import {Field, Input} from "@src/shared/view";
import {createMemo, JSX} from "solid-js";
import {useSharedContext} from "@src/shared/context";
import {Parameter} from "@src/shared/type";

i18next.addResourceBundle("en", "project", {MinScaleField: en}, true, true);

export function MinScaleField(): JSX.Element {
    const sharedContext = useSharedContext();

    const minScale = createMemo(
        () => sharedContext.database.data.config.selectByParams<Parameter>({name: "minScale"})[0]
    );

    function handleChange (event: Event): void {
        const target = event.target as HTMLInputElement;
        sharedContext.database.data.config.update<Parameter>(
            minScale().id,
            {value: Number(target.value)}
        );
    }

    return (
        <Field>
            <label for="minScale">
                {i18next.t(
                    "project:MinScaleField.label",
                    {postProcess: ["capitalize"]}
                )}
            </label>
            <Input
                type="number"
                name="minScale"
                step="0.1"
                // min="0"
                // max="10"
                value={String(minScale().value)}
                onChange={handleChange}
            />
        </Field>
    );
}