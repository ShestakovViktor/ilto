import * as styles from "./MarkerWidget.module.scss";
import MarkerIconSvg from "@res/svg/small/marker.svg";
import {
    JSX,
    Show,
    Accessor,
    createMemo,
    For,
} from "solid-js";
import {EntityView} from "@src/entity/widget";
import {useSharedContext} from "@src/shared/context";
import {Icon} from "@src/shared/view";
import {useViewerContext} from "@src/viewer/context";
import {Marker} from "@src/entity/type";
import {Prop} from "@src/asset/type";

type Props = {
    entity: Accessor<Marker>;
};

export function MarkerWidget(props: Props): JSX.Element {
    const {database} = useSharedContext();
    const {viewer, path} = useViewerContext();

    let element!: HTMLDivElement;

    const transform = createMemo((): string => {
        const x = props.entity().x * viewer.scale;
        const y = props.entity().y * viewer.scale;

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

        const prop = database.data.asset.select<Prop>(propId);

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