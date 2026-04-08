import en from "./string/en.json";
import * as styles from "./InitUtility.module.scss";
import i18next from "i18next";
import {JSX} from "solid-js";
import {Field} from "../../UtilityBar/widget/Field";
import {initProject} from "@src/editor/service";
import {Widget} from "../../UtilityBar/widget/Widget";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "editor", {InitTool: en}, true, true);

type Props = {
    uid: string;
};

export function InitUtility(props: Props): JSX.Element {
    const {storage} = useEditorContext();

    function projectCreate(event: SubmitEvent): void {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        form.reset();

        const name = String(formData.get("name"));
        const width = Number(formData.get("width"));
        const height = Number(formData.get("height"));

        initProject(storage, {name, width, height});
    }

    return (
        <Widget uid={props.uid} title="Init">
            <form
                class={styles.InitTool}
                onSubmit={projectCreate}
            >
                <Field
                    label={
                        i18next.t(
                            "editor:InitTool.nameField",
                            {postProcess: ["capitalize"]}
                        )
                    }
                    name="name"
                    type="text"
                    required
                />
                <Field
                    label={
                        i18next.t(
                            "editor:InitTool.width",
                            {postProcess: ["capitalize"]}
                        )
                    }
                    name="width"
                    type="number"
                    required
                />
                <Field
                    label={
                        i18next.t(
                            "editor:InitTool.height",
                            {postProcess: ["capitalize"]}
                        )
                    }
                    name="height"
                    type="number"
                    required
                />
                <input
                    type="submit"
                    value={i18next.t(
                        "editor:InitTool.create",
                        {postprocess: ["capitalize"]}
                    )}
                />
            </form>
        </Widget>
    );
}