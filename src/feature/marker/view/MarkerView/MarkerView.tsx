import * as styles from "./MarkerView.module.scss";
import MarkerIconSvg from "@res/svg/marker.svg";
import {
    JSX,
    Show,
    Accessor,
    createMemo,
    For,
} from "solid-js";
import {EntityView} from "@feature/entity/view";
import {useStoreContext} from "@feature/store/context";
import {Icon} from "@shared/view";
import {useViewerContext} from "@feature/viewer/context";
import {Marker} from "@feature/marker/type";
import {Prop} from "@feature/prop/type";

type Props = {
    entity: Accessor<Marker>;
};

export function MarkerView(props: Props): JSX.Element {
    const storeContext = useStoreContext();
    const viewerContext = useViewerContext();

    let element!: HTMLDivElement;

    const transform = createMemo((): string => {
        const x = props.entity().x * viewerContext.state.scale;
        const y = props.entity().y * viewerContext.state.scale;

        return `translate3d(${x}px, ${y}px, 0px)`;
    });

    const style = createMemo((): JSX.CSSProperties => {
        return {
            transform: "translate3d(-50%, -50%, 0)",
            width: props.entity().width + "px",
            height: props.entity().height + "px",
        };
    });

    const propSrc = createMemo((): string | undefined => {
        const propId = props.entity().propId;

        if (!propId) return undefined;

        const prop = storeContext.store.asset.select<Prop>(propId);

        if (!prop) return undefined;

        const src = viewerContext.path + prop.path;

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

        viewerContext.viewport?.focus(props.entity().x, props.entity().y);
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