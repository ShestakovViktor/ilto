import en from "./string/en.json";
import i18next from "i18next";

import {JSX, createMemo} from "solid-js";
import {useEditorContext} from "@feature/editor/context";
import {Field, Input} from "@shared/view";
import {Entity} from "@feature/entity/type";
import {useStoreContext} from "@feature/store/context";
import {Accordion, Section} from "@feature/toolkit/view";

i18next.addResourceBundle("en", "tool", {Entity: en}, true, true);

export function EntityTool(): JSX.Element {
    const editorContext = useEditorContext();
    const {store} = useStoreContext();

    const entity = createMemo(
        () => editorContext.state.selected || {} as Entity
    );

    function handleXChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        store.entity.update(entity().id, {x: Number(target.value)});
    }

    function handleYChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        store.entity.update(entity().id, {y: Number(target.value)});
    }

    function handleWidthChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        store.entity.update(entity().id, {width: Number(target.value)});
    }

    function handleHeightChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        store.entity.update(entity().id, {height: Number(target.value)});
    }

    const labels = {
        id: i18next.t(
            "tool:Entity.idLabel",
            {postProcess: ["capitalize"]}
        ),
        entityTypeId: i18next.t(
            "tool:Entity.entityTypeIdLabel",
            {postProcess: ["capitalize"]}
        ),
        x: i18next.t(
            "tool:Entity.xLabel",
            {postProcess: ["capitalize"]}
        ),
        y: i18next.t(
            "tool:Entity.yLabel",
            {postProcess: ["capitalize"]}
        ),
        width: i18next.t(
            "tool:Entity.widthLabel",
            {postProcess: ["capitalize"]}
        ),
        height: i18next.t(
            "tool:Entity.heightLabel",
            {postProcess: ["capitalize"]}
        ),
    };

    return (
        <Accordion>
            <Section title="system">
                <Field>
                    <label for="id">{labels.id}</label>
                    <Input
                        name="id"
                        value={String(entity()?.id)}
                        readonly
                    />
                </Field>
                <Field>
                    <label for="entityTypeId">{labels.entityTypeId}</label>
                    <Input
                        name="entityTypeId"
                        value={String(entity()?.entityTypeId)}
                        readonly
                    />
                </Field>
            </Section>
            <Section title="position">
                <Field>
                    <label for="x">{labels.x}</label>
                    <Input
                        type="number"
                        name="x"
                        value={String(entity().x)}
                        onChange={handleXChange}
                    />
                </Field>
                <Field>
                    <label for="y">{labels.y}</label>
                    <Input
                        type="number"
                        name="y"
                        value={String(entity().y)}
                        onChange={handleYChange}
                    />
                </Field>
            </Section>
            <Section title="size">
                <Field>
                    <label for="width">{labels.width}</label>
                    <Input
                        type="number"
                        name="width"
                        value={String(entity().width)}
                        onChange={handleWidthChange}
                    />
                </Field>
                <Field>
                    <label for="height">{labels.height}</label>
                    <Input
                        type="number"
                        name="height"
                        value={String(entity().height)}
                        onChange={handleHeightChange}
                    />
                </Field>
            </Section>
        </Accordion>
    );
}