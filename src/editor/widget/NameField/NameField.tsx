import en from "./string/en.json";

import i18next from "i18next";
import {Field} from "@src/core/widget";
import {JSX} from "solid-js";

i18next.addResourceBundle(
    "en", "asset", {NameField: en}, true, true
);

export function NameField(): JSX.Element {
    return (
        <Field
            label= {i18next.t(
                "asset:NameField.label",
                {postProcess: ["capitalize"]}
            )}
            type="text"
            name="name"
            required
        />
    );
}