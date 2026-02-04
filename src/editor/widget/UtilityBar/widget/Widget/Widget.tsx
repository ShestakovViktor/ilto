import * as styles from "./Widget.module.scss";
import {JSX, children} from "solid-js";
import {useEditorContext} from "@src/editor/context";

type Props = {
    children: JSX.Element | JSX.Element[];
    title: string;
    uid: string;
    class?: string;
};

export function Widget(props: Props): JSX.Element {
    const {storage, setStorage} = useEditorContext();

    let contentRef!: HTMLDivElement;

    const childs = children(() => props.children);

    const {uid} = props;

    if (!storage.widget[uid]) {
        setStorage("widget", uid, () => ({collapsed: true}));
    }

    const state = storage.widget[uid];

    function toggleCollapsed() {
        setStorage("widget", uid, "collapsed", (prev) => !prev);
    }

    function startResize(event: MouseEvent) {
        const y = event.y;
        const h = state.height || contentRef.getBoundingClientRect().height;

        function handleResize(event: MouseEvent) {

            if (event.button === 0 && y != undefined) {
                setStorage("widget", uid, "height", h + (event.y - y));
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
                [styles.Collapsed]: state.collapsed,
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
                    {state.collapsed ? "+" : "-"}
                </div>
            </div>
            <div
                class={styles.Content}
                classList={{
                    [props?.class ?? ""]: true,
                }}
                style={{height: state.height + "px"}}
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