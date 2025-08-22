import * as styles from "./ToolView.module.scss";
import {JSX, Match, Switch} from "solid-js";
import {useEditorContext} from "@feature/editor/context";
import {DisplayTool, EntityTool, ExportTool} from "@feature/toolkit/view";
import {TOOLKIT_MODE} from "@feature/editor/enum";
import {Explorer} from "@feature/toolkit/view";
import {Accordion, Section} from "@shared/view";

export function ToolView(): JSX.Element {
    const {state} = useEditorContext();

    const accordionStyles = {
        accordion: styles.Accordion,
        header: styles.Header,
        title: styles.Title,
        section: styles.Section,
        content: styles.Content,
    };

    return (
        <div class={styles.ToolView}>
            <Switch >
                <Match when={state.toolkit == TOOLKIT_MODE.SYSTEM}>
                    <Accordion classList={accordionStyles}>
                        <Section title="File">
                            <ExportTool/>
                        </Section>
                    </Accordion>
                </Match>
                <Match when={state.toolkit == TOOLKIT_MODE.EXPLORE}>
                    <Accordion classList={accordionStyles}>
                        <Section title="Explorer">
                            <Explorer/>
                        </Section>
                        <Section title="Entity">
                            <EntityTool/>
                        </Section>
                        <Section title="Display">
                            <DisplayTool/>
                        </Section>
                    </Accordion>
                </Match>
                <Match when={state.toolkit == TOOLKIT_MODE.EDIT}>
                    <Accordion classList={accordionStyles}>
                        <Section title="Entity">
                            <EntityTool/>
                        </Section>
                    </Accordion>
                </Match>
            </Switch>
        </div>
    );
}