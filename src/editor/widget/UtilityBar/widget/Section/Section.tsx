import {useEditorContext} from "@src/editor/context";
import * as styles from "./Section.module.scss";
import {JSX, children} from "solid-js";

type Props = {
    children: JSX.Element | JSX.Element[];
    title: string;
    uid: string;
    class?: string;
};

export function Section(props: Props): JSX.Element {
    const {uid} = props;

    const childs = children(() => props.children);

    const {cache, setCache} = useEditorContext();

    if (!cache.widget[uid]) {
        setCache("widget", uid, () => ({collapsed: true}));
    }

    const state = cache.widget[uid];

    function toggleCollapsed() {
        setCache("widget", uid, "collapsed", (prev) => !prev);
    }

    return (
        <div
            class={styles.Section}
            classList={{
                [styles.Expand]: state.collapsed,
            }}
        >
            <div
                class={styles.Header}
                onClick={toggleCollapsed}
            >
                <div class={styles.Title}>
                    {props.title}
                </div>
                <div
                    class={styles.Expand}
                >
                    {state.collapsed ? "-" : "+"}
                </div>
            </div>
            <div
                class={styles.Content}
                classList={{
                    [props.class || ""]: Boolean(props.class),
                }}
            >
                {childs()}
            </div>
        </div>
    );
}