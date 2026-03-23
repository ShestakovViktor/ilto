import en from "./string/en.json";

import {createMemo, JSX} from "solid-js";
import i18next from "i18next";
import {useViewerContext} from "@src/viewer/context";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    entityId: number;
    children: JSX.Element;
};

export function FootnoteFigure(props: Props): JSX.Element {
    const {storage, path} = useViewerContext();

    const figureSrc = createMemo((): string | undefined => {
        const figureId = props.entityId;

        if (!figureId) return undefined;

        const figure = storage.data.asset.select(figureId);

        if (!figure) return undefined;

        const src = path + figure.path;

        return src;
    });

    return (
        <img src={figureSrc()}/>
    );
}