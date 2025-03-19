import en from "./string/en.json";

import {createMemo, JSX} from "solid-js";
import i18next from "i18next";
import {useStoreContext} from "@feature/store/context";
import {Figure as Fig} from "@feature/figure/type";
import {useViewerContext} from "@feature/viewer/context";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    entityId: number;
    children: JSX.Element;
};

export function FootnoteFigure(props: Props): JSX.Element {
    const storeContext = useStoreContext();
    const viewerContext = useViewerContext();

    const figureSrc = createMemo((): string | undefined => {
        const figureId = props.entityId;

        if (!figureId) return undefined;

        const figure = storeContext.store.asset.getById<Fig>(figureId);

        if (!figure) return undefined;

        const src = viewerContext.path + figure.path;

        return src;
    });

    return (
        <img src={figureSrc()}/>
    );
}