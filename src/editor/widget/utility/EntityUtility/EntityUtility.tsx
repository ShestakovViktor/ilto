import en from "./string/en.json";
import i18next from "i18next";

import {JSX, Show, createMemo} from "solid-js";
import {ScopeProvidor, useEditorContext} from "@src/editor/context";
import {Entity, isSize, isSpatial, Size, Spatial} from "@src/core/type";
import {Widget, Section, Field} from "@src/editor/widget/UtilityBar/widget";

i18next.addResourceBundle("en", "tool", {Entity: en}, true, true);

export function EntityUtility(): JSX.Element {
    const {storage, session} = useEditorContext();

    const entityMemo = createMemo(
        () => session.selected || {} as Entity
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
        storage.data.entity.update<Entity & Spatial>(
            entityMemo().id,
            {x: Number(target.value)}
        );
    }

    function handleYChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        storage.data.entity.update<Entity & Spatial>(
            entityMemo().id,
            {y: Number(target.value)}
        );
    }

    function handleWidthChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        storage.data.entity.update<Entity & Size>(
            entityMemo().id,
            {w: Number(target.value)}
        );
    }

    function handleHeightChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        storage.data.entity.update<Entity & Size>(
            entityMemo().id,
            {h: Number(target.value)}
        );
    }

    const labels = {
        id: i18next.t(
            "tool:Entity.idLabel",
            {postProcess: ["capitalize"]}
        ),
        kind: i18next.t(
            "tool:Entity.kindLabel",
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
        <ScopeProvidor value="EntityUtility">
            <Widget title="Entity">
                <ScopeProvidor value="SystemSection">
                    <Section title="system">
                        <Field
                            label={labels.id}
                            name="id"
                            value={String(entityMemo()?.id)}
                            readonly
                        />
                        <Field
                            label={labels.kind}
                            name="kind"
                            value={String(entityMemo()?.kind)}
                            readonly
                        />
                    </Section>
                </ScopeProvidor>

                <Show when={spatialMemo()} fallback={<></>}>
                    <ScopeProvidor value="PositionSection">
                        <Section title="position">
                            <Field
                                label={labels.x}
                                type="number"
                                name="x"
                                value={String(spatialMemo()?.x)}
                                onChange={handleXChange}
                            />
                            <Field
                                label={labels.y}
                                type="number"
                                name="y"
                                value={String(spatialMemo()?.y)}
                                onChange={handleYChange}
                            />
                        </Section>
                    </ScopeProvidor>
                </Show>
                <Show when={sizeMemo()} fallback={<></>}>
                    <ScopeProvidor value="SizeSection">
                        <Section title="size">
                            <Field
                                label={labels.width}
                                type="number"
                                name="width"
                                value={String(sizeMemo()?.w)}
                                onChange={handleWidthChange}
                            />
                            <Field
                                label={labels.height}
                                type="number"
                                name="height"
                                value={String(sizeMemo()?.h)}
                                onChange={handleHeightChange}
                            />
                        </Section>
                    </ScopeProvidor>
                </Show>
            </Widget>
        </ScopeProvidor>
    );
}