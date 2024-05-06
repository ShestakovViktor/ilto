import styles from "./MarkerWidget.module.scss";
import {JSX, Show, Suspense, createEffect, createResource, createSignal, on} from "solid-js";
import {Marker, Id, Prop} from "@type";
import {useViewerContext} from "@ui/viewer/context";
import {assetToSrc} from "@ui/app/utiliy";

type Props = {
    entityId: Id;
};

export function MarkerWidget(props: Props): JSX.Element {
    const viewerCtx = useViewerContext();

    const [entity, {refetch}] = createResource(() => viewerCtx.store.entity
        .getById<Marker>(props.entityId));

    createEffect(on(viewerCtx.render, refetch));

    const x = (): string => {
        const data = entity();
        return data
            ? `calc(${data.x * viewerCtx.mapCtx.scale}px - 50%)`
            : "0px";
    };

    const y = (): string => {
        const data = entity();
        return data
            ? `calc(${data.y * viewerCtx.mapCtx.scale}px - 50%)`
            : "0px";
    };

    const src = (): string => {
        const propId = entity()?.propId;

        if (!propId) {
            return "./icon/marker.svg";
        }
        else {
            const asset = viewerCtx.store.asset
                .getById<Prop>(propId);

            if (!asset) throw new Error();

            return asset.path || assetToSrc(asset);
        }
    };

    const [showInfo, setShowInfo] = createSignal(false);

    let info: HTMLDivElement;

    return (
        <Suspense>
            <div
                class={styles.MarkerWidget}
                data-id={entity()?.id}
                data-type={"marker"}
                style={{transform: `translate3d(${x()}, ${y()}, 0)`}}
            >
                <img
                    class={styles.Mark}
                    src={src()}
                    onclick={(event) => {
                        setShowInfo(true);

                        window.addEventListener("pointerdown", (event) => {
                            if (!info.contains(event.target as HTMLElement)) {
                                setShowInfo(false);
                            }
                        });

                        event.stopPropagation();
                    }}
                />

                <Show when={showInfo()}>
                    <div class={styles.Info} ref={info!}>
                        <p class={styles.Text}>{entity()?.text}</p>
                        {/* <Show when={data()?.graphicIds.length}>
                            <img
                                class={styles.Graphic}
                                src={
                                    viewerCtx.store.source
                                        .getById(data()?.graphicIds[0]).content
                                }
                            />
                        </Show> */}
                    </div>
                </Show>
            </div>
        </Suspense>
    );
}