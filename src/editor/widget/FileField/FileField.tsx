import en from "./string/en.json";

import i18next from "i18next";
import {Field} from "@src/core/widget";
import {JSX} from "solid-js";

i18next.addResourceBundle(
    "en", "asset", {FileField: en}, true, true
);

type Props = {
    accept?: string;
};

export function FileField(props: Props): JSX.Element {
    return (
        <Field
            label=
                {i18next.t(
                    "asset:FileField.label",
                    {postProcess: ["capitalize"]}
                )}
            type="file"
            name="file"
            accept={props.accept}
            required
        />
    );
}