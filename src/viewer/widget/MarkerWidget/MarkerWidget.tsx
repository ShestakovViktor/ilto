import * as styles from "./MarkerWidget.module.scss";
import MarkerIconSvg from "@res/svg/small/marker.svg";
import {
    JSX,
    Show,
    Accessor,
    createMemo,
    For,
} from "solid-js";
import {EntityView} from "@src/viewer/widget";
import {Icon} from "@src/core/widget";
import {useViewerContext} from "@src/viewer/context";
import {Marker} from "@src/core/type";
import {Asset} from "@src/core/type";

type Props = {
    entity: Accessor<Marker>;
};

export function MarkerWidget(props: Props): JSX.Element {
    const {storage, path} = useViewerContext();

    let element!: HTMLDivElement;

    const transform = createMemo((): string => {
        const x = props.entity().x;
        const y = props.entity().y;

        return `translate3d(${x}px, ${y}px, 0px)`;
    });

    const style = createMemo((): JSX.CSSProperties => {
        return {
            transform: "translate3d(-50%, -50%, 0)",
            width: props.entity().w + "px",
            height: props.entity().h + "px",
        };
    });

    const propSrc = createMemo((): string | undefined => {
        const propId = props.entity().propId;

        if (!propId) return undefined;

        const prop = storage.data.asset.select<Asset>(propId);

        if (!prop) return undefined;

        const src = path + prop.path;

        return src;
    });

    function handleOffClick(event: PointerEvent): void {
        if (
            event.target instanceof Element
            && !element.contains(event.target)
            && element.classList.contains(styles.Show)
        ) {
            element.classList.toggle(styles.Show);
            window.removeEventListener("pointerdown", handleOffClick);
        }
    }

    function handleClick(): void {
        if (!element.classList.contains(styles.Show)) {
            window.addEventListener("pointerdown", handleOffClick);
        }
        element.classList.toggle(styles.Show);

        // viewManager.focus(props.entity().x, props.entity().y);
    }

    return (
        <div
            class={styles.MarkerView}
            data-entity-id={props.entity().id}
            style={{transform: transform()}}
            draggable={false}
            ref={element}
        >
            <div
                class={styles.Marker}
                style={style()}
                onMouseDown={handleClick}
                onTouchStart={handleClick}
            >
                <Show
                    when={propSrc()}
                    fallback={(
                        <Icon
                            svg={MarkerIconSvg}
                            class={styles.Prop}
                        />
                    )}
                >
                    {<img
                        class={styles.Prop}
                        src={propSrc()}
                        draggable={false}
                    />}
                </Show>
            </div>

            <For each={props.entity().childIds}>
                {id => <EntityView entityId={id}/>}
            </For>
        </div>
    );
}