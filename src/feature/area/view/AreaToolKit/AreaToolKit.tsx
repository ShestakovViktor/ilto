import {Button, Toolbar} from "@shared/view";
import en from "./string/en.json";

import i18next from "i18next";
import {JSX} from "solid-js";

i18next.addResourceBundle("en", "area", {AreaToolbar: en}, true, true);

export function AreaToolKit(): JSX.Element {
    // const editorContext = useEditorContext();
    // const viewerContext = useViewerContext();

    // const [getAreaId] = props.entityId
    //     ?? createSignal<Id | null>();

    // function deleteLastPoint(): void {
    //     const areaId = getAreaId();
    //     if (!areaId) return;

    //     const area = editorContext.store.entity.getById<Area>(areaId);
    //     if (!area) throw new Error();

    //     popAreaPoint(area);
    //     editorContext.store.entity.set(area);
    //     viewerContext.reRender();
    // }

    return (
        <Toolbar>
            <Button
            />
        </Toolbar>
    );
}