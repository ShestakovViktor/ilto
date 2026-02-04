import en from "./string/en.json";
import i18next from "i18next";

import {JSX, Show, createMemo} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {Field, Input} from "@src/shared/view";
import {Entity, isSize, isSpatial, Size, Spatial} from "@src/entity/type";
import {useSharedContext} from "@src/shared/context";
import {Widget, Section} from "@src/editor/widget/UtilityBar/widget";

i18next.addResourceBundle("en", "tool", {Entity: en}, true, true);

type Props = {
    uid: string;
};

export function EntityUtility(props: Props): JSX.Element {
    const editorContext = useEditorContext();
    const {database} = useSharedContext();

    const entityMemo = createMemo(
        () => editorContext.session.selected || {} as Entity
    );

    const spatialMemo = createMemo(() => {
        const entity = entityMemo();
        return isSpatial(entity) ? entity : undefined;
    });

    const sizeMemo = createMemo(() => {
        const entity = entityMemo();
        return isSize(entity) ? entity : undefined;
    });

    function handleXChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        database.data.entity
            .update<Spatial>(entityMemo().id, {x: Number(target.value)});
    }

    function handleYChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        database.data.entity
            .update<Spatial>(entityMemo().id, {y: Number(target.value)});
    }

    function handleWidthChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        database.data.entity
            .update<Size>(entityMemo().id, {width: Number(target.value)});
    }

    function handleHeightChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        database.data.entity
            .update<Size>(entityMemo().id, {height: Number(target.value)});
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
        <Widget uid={props.uid} title="Entity">
            <Section uid="vadf" title="system">
                <Field>
                    <label for="id">{labels.id}</label>
                    <Input
                        name="id"
                        value={String(entityMemo()?.id)}
                        readonly
                    />
                </Field>
                <Field>
                    <label for="entityTypeId">{labels.entityTypeId}</label>
                    <Input
                        name="entityTypeId"
                        value={String(entityMemo()?.entityTypeId)}
                        readonly
                    />
                </Field>
            </Section>
            <Show when={spatialMemo()} fallback={<></>}>
                <Section uid="vads" title="position">
                    <Field>
                        <label for="x">{labels.x}</label>
                        <Input
                            type="number"
                            name="x"
                            value={String(spatialMemo()?.x)}
                            onChange={handleXChange}
                        />
                    </Field>
                    <Field>
                        <label for="y">{labels.y}</label>
                        <Input
                            type="number"
                            name="y"
                            value={String(spatialMemo()?.y)}
                            onChange={handleYChange}
                        />
                    </Field>
                </Section>
            </Show>
            <Show when={sizeMemo()} fallback={<></>}>
                <Section uid="whfl" title="size">
                    <Field>
                        <label for="width">{labels.width}</label>
                        <Input
                            type="number"
                            name="width"
                            value={String(sizeMemo()?.width)}
                            onChange={handleWidthChange}
                        />
                    </Field>
                    <Field>
                        <label for="height">{labels.height}</label>
                        <Input
                            type="number"
                            name="height"
                            value={String(sizeMemo()?.height)}
                            onChange={handleHeightChange}
                        />
                    </Field>
                </Section>
            </Show>
        </Widget>
    );
}