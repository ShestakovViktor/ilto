import en from "./string/en.json";
import * as styles from "./InitUtility.module.scss";
import i18next from "i18next";
import {JSX} from "solid-js";
import {Field} from "../UtilityBar/widget/Field";
import {useSharedContext} from "@src/shared/context";
import {initProject} from "@src/editor/service";
import {Widget} from "../UtilityBar/widget/Widget";

i18next.addResourceBundle("en", "editor", {InitTool: en}, true, true);

export function InitUtility(): JSX.Element {
    const {database} = useSharedContext();

    function projectCreate(event: SubmitEvent): void {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        form.reset();

        const name = String(formData.get("name"));
        const width = Number(formData.get("width"));
        const height = Number(formData.get("height"));
        const background = formData.get("background") as File;

        initProject(database, {name, width, height, background});
    }

    return (
        <Widget uid="wlaf" title="Init">
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
                <Field
                    label={
                        i18next.t(
                            "editor:InitTool.backgroundField",
                            {postProcess: ["capitalize"]}
                        )
                    }
                    name="background"
                    type="file"
                    accept="image/*"
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