import * as styles from "./ImageView.module.scss";
import {Accessor, JSX, Match, Switch, createMemo} from "solid-js";
import {Image} from "@src/core/type";
import {useViewerContext} from "@src/viewer/context";
import {MimeType} from "@src/core/enum";

type Props = {
    entity: Accessor<Image>;
};

export function ImageView({entity}: Props): JSX.Element {
    const {storage, path} = useViewerContext();

    const asset = createMemo(() => {
        const asset = storage.data.asset.select(entity().assetId);
        if (!asset) throw new Error();
        return asset;
    });

    return (
        <Switch>
            <Match when={asset().mime == MimeType.Svg}>
                <svg
                    class={styles.Image}
                    style={{
                        "--x": `${entity().x}px`,
                        "--y": `${entity().y}px`,
                        "--w": `${entity().w}px`,
                        "--h": `${entity().h}px`,
                    }}
                >
                    <use href={path + asset().path + "#root"} />
                </svg>
            </Match>
            <Match when={asset().mime == MimeType.Png}>
                <img
                    class={styles.Image}
                    style={{
                        "--x": `${entity().x}px`,
                        "--y": `${entity().y}px`,
                        "--w": `${entity().w}px`,
                        "--h": `${entity().h}px`,
                    }}

                    src={path + asset().path} draggable={false}
                />
            </Match>
        </Switch>
    );
}