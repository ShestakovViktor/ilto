import * as styles from "./TileView.module.scss";
import {Accessor, JSX, createMemo} from "solid-js";
import {Tile} from "@feature/tile/type";
import {useStoreContext} from "@feature/store/context";
import {useViewerContext} from "@feature/viewer/context";

type Props = {
    entity: Accessor<Tile>;
};

export function TileView({entity}: Props): JSX.Element {
    const storeContext = useStoreContext();
    const viewerContext = useViewerContext();

    const style = createMemo((): JSX.CSSProperties => {
        return {transform: `translate3d(${entity().x}px, ${entity().y}px, 0)`};
    });

    const src = createMemo((): string => {
        const imageId = entity().imageId;

        if (!imageId) {
            return "";
        }
        else {
            const tile = storeContext.store.asset.getById(imageId);

            if (!tile) throw new Error();

            const src = viewerContext.path + tile.path;

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