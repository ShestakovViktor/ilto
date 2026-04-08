import en from "./string/en.json";

import i18next from "i18next";
import {Field} from "@src/core/widget";
import {JSX} from "solid-js";

i18next.addResourceBundle(
    "en", "asset", {WidthField: en}, true, true
);

export function WidthField(): JSX.Element {
    return (
        <Field
            label=
                {i18next.t(
                    "asset:WidthField.label",
                    {postProcess: ["capitalize"]}
                )}
            type="number"
            name="width"
            required
        />
    );
}