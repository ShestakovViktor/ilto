import styles from "./AreaWidget.module.scss";
import {
    JSX,
    createSignal,
    createMemo,
} from "solid-js";
import {useViewerContext} from "@ui/viewer/context";
import {Area, Figure} from "@type";
import {updateEffect} from "@ui/viewer/utility";
import {InfoPopup} from "@ui/viewer/widget";

type Props = {
    entity: Area;
};

export function AreaWidget(props: Props): JSX.Element {
    const viewerCtx = useViewerContext();
    const [show, setShow] = createSignal(false);

    const fetchEntity = (): Area => {
        const entity = viewerCtx.store.entity.getById<Area>(props.entity.id);
        if (!entity) throw new Error(`Entity not exists ${props.entity.id}`);
        return entity;
    };

    const equals = (prev: Area, next: Area): boolean => {
        return prev.x == next.x
            && prev.y == next.y
            && prev.text == next.text
            && prev.figureIds == next.figureIds;
    };

    const [entity, setEntity] = createSignal<Area>(props.entity, {equals});

    updateEffect(viewerCtx.render, fetchEntity, setEntity, props.entity.id);

    const factor = createMemo((): number => 5 / viewerCtx.layout.scale);

    const transform = createMemo((): string => {
        const x = entity().x * viewerCtx.layout.scale;
        const y = entity().y * viewerCtx.layout.scale;
        return `translate3d(${x}px, ${y}px, 0px)`;
    });

    const width = createMemo((): string => {
        return entity().width * viewerCtx.layout.scale + "px";
    });

    const height = createMemo((): string => {
        return entity().height * viewerCtx.layout.scale + "px";
    });

    const viewBox = createMemo((): string => {
        const x = -entity().width / 2 - factor();
        const y = -entity().height / 2 - factor();
        const width = entity().width + factor() * 2;
        const height = entity().height + factor() * 2;

        return `${x} ${y} ${width} ${height}`;
    });

    const polygon = createMemo((): JSX.Element => {
        const points = entity().points
            .reduce((r, p) => r + ` ${p.x},${p.y}`, "");

        return (
            <polygon
                fill="#0003"
                points={points}
                onMouseEnter={() => {
                    setShow(true);
                }}
                onMouseLeave={() => {
                    setShow(false);
                }}
            />
        );
    });

    const helpers = createMemo((): JSX.Element[] => {
        return entity().points
            .map((point) =>
                <circle
                    cx={point.x}
                    cy={point.y}
                    r={factor()}
                    fill="#000f"
                />
            );
    });

    const text = createMemo((): string => entity().text);

    const figures = createMemo((): Figure[] => {
        return entity().figureIds.map((id) => {
            const figure = viewerCtx.store.asset.getById<Figure>(id);
            if (!figure) throw new Error();
            return figure;
        });
    });

    return (
        <div
            class={styles.AreaWidget}
            data-entity-id={entity().id}
            style={{transform: transform()}}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBox()}
                width={width()}
                height={height()}
            >
                {polygon()}
                {helpers()}
            </svg>

            <InfoPopup
                state={[show, setShow]}
                text={text()}
                figures={figures()}
            />
        </div>
    );
}