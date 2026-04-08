import en from "./string/en.json";

import i18next from "i18next";
import {Field} from "@src/core/widget";
import {JSX} from "solid-js";

i18next.addResourceBundle(
    "en", "asset", {ClassField: en}, true, true
);

export function ClassField(): JSX.Element {
    return (
        <Field
            label={i18next.t(
                "asset:ClassField.label",
                {postProcess: ["capitalize"]}
            )}
            type="text"
            name="class"
            required

        />
    );
}