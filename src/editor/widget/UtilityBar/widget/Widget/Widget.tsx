import * as styles from "./Widget.module.scss";
import {JSX, children, createSignal} from "solid-js";
import {useScopeContext} from "@src/editor/context";

type Config = {
    collapsed: boolean;
    height: number;
};

type Props = {
    children: JSX.Element | JSX.Element[];
    title: string;
    class?: string;
};

export function Widget(props: Props): JSX.Element {
    const {data: config, setData: setConfig} = useScopeContext<Config>();

    let contentRef!: HTMLDivElement;

    const childs = children(() => props.children);

    const [collapsed, setCollapsed] = createSignal(config().collapsed);

    const [height, setHeight] = createSignal(config().height);

    function toggleCollapsed() {
        setCollapsed(!collapsed());
        setConfig({collapsed: collapsed()});
    }

    function startResize(event: MouseEvent) {
        const y = event.y;
        const h = height() || contentRef
            .getBoundingClientRect().height;

        function handleResize(event: MouseEvent) {
            if (event.button === 0 && y != undefined) {
                const height = h + (event.y - y);
                setHeight(height);
                setConfig({height});
            }
        }

        function stopResize() {
            window.removeEventListener("mousemove", handleResize);
            window.removeEventListener("mouseup", stopResize);
        }

        window.addEventListener("mousemove", handleResize);
        window.addEventListener("mouseup", stopResize);

        event.preventDefault();
    }

    return (
        <div
            class={styles.Widget}
            classList={{
                [styles.Collapsed]: collapsed(),
            }}
        >
            <div
                class={styles.Header}

                onClick={() => toggleCollapsed()}
            >
                <div class={styles.Title}>
                    {props.title}
                </div>
                <div class={styles.Collapsed}>
                    {collapsed() ? "+" : "-"}
                </div>
            </div>
            <div
                class={styles.Content}
                classList={{
                    [props?.class ?? ""]: true,
                }}
                style={{height: height() + "px"}}
                ref={contentRef}
            >
                {childs()}
            </div>
            <div
                class={styles.Edge}
                onMouseDown={startResize}
            >
            </div>
        </div>
    );
}