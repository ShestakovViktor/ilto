import styles from "./CreatePage.module.scss";

import {JSX} from "solid-js";
import {ProjectForm} from "@feature/editor/view";
import {Page} from "@shared/view";

export function CreatePage(): JSX.Element {
    return (
        <Page class={styles.CreatePage}>
            <ProjectForm />
        </Page>
    );
}