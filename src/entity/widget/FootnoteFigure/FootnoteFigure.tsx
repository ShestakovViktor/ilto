import en from "./string/en.json";

import {createMemo, JSX} from "solid-js";
import i18next from "i18next";
import {useSharedContext} from "@src/shared/context";
import {Figure as Fig} from "@src/asset/type";
import {useViewerContext} from "@src/viewer/context";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    entityId: number;
    children: JSX.Element;
};

export function FootnoteFigure(props: Props): JSX.Element {
    const sharedContext = useSharedContext();
    const viewerContext = useViewerContext();

    const figureSrc = createMemo((): string | undefined => {
        const figureId = props.entityId;

        if (!figureId) return undefined;

        const figure = sharedContext.database.data.asset.select<Fig>(figureId);

        if (!figure) return undefined;

        const src = viewerContext.path + figure.path;

        return src;
    });

    return (
        <img src={figureSrc()}/>
    );
}