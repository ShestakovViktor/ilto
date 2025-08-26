import en from "./string/en.json";
import i18next from "i18next";

import {Field, Input} from "@src/shared/view";
import {createMemo, JSX} from "solid-js";
import {useSharedContext} from "@src/shared/context";
import {Parameter} from "@src/shared/type";

i18next.addResourceBundle("en", "project", {MaxScaleField: en}, true, true);

export function MaxScaleField(): JSX.Element {
    const sharedContext = useSharedContext();

    const maxScale = createMemo(
        () => sharedContext.database.data.config.selectByParams<Parameter>({name: "maxScale"})[0]
    );

    function handleChange (event: Event): void {
        const target = event.target as HTMLInputElement;
        sharedContext.database.data.config.update<Parameter>(
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