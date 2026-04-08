import * as styles from "./TileView.module.scss";
import {Accessor, JSX, createMemo} from "solid-js";
import {Tile} from "@src/core/type";
import {useViewerContext} from "@src/viewer/context";

type Props = {
    entity: Accessor<Tile>;
};

export function TileView({entity}: Props): JSX.Element {
    const {storage, path} = useViewerContext();

    const style = createMemo((): JSX.CSSProperties => {
        return {transform: `translate3d(${entity().x}px, ${entity().y}px, 0)`};
    });

    const src = createMemo((): string => {
        const imageId = entity().imageId;

        if (!imageId) {
            return "";
        }
        else {
            const tile = storage.data.asset.select(imageId);

            if (!tile) throw new Error();

            const src = path + tile.path;

            return src;
        }
    });

    return (
        <img
            class={styles.Tile}
            src={src()}
            style={style()}
            draggable={false}
        />
    );
}