import en from "./string/en.json";

import i18next from "i18next";
import {Field} from "@src/core/widget";
import {JSX} from "solid-js";

i18next.addResourceBundle(
    "en", "asset", {HeightField: en}, true, true
);

export function HeightField(): JSX.Element {
    return (
        <Field
            label= {i18next.t(
                "asset:HeightField.label",
                {postProcess: ["capitalize"]}
            )}
            type="number"
            name="height"
            required
        />
    );
}