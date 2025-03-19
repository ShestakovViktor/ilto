import en from "./string/en.json";
import i18next from "i18next";

import {Field, Input} from "@shared/view";
import {createMemo, JSX} from "solid-js";
import {useStoreContext} from "@feature/store/context";
import {Param} from "@type";

i18next.addResourceBundle("en", "project", {MinScaleField: en}, true, true);

export function MinScaleField(): JSX.Element {
    const storeContext = useStoreContext();

    const minScale = createMemo(
        () => storeContext.store.config.getByParams({name: "minScale"})[0]
    );

    function handleChange (event: Event): void {
        const target = event.target as HTMLInputElement;
        storeContext.store.config.set<Param>(
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