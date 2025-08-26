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

    const {storage, setStorage} = useEditorContext();

    if (!storage.widget[uid]) {
        setStorage("widget", uid, () => ({collapsed: true}));
    }

    const state = storage.widget[uid];

    function toggleCollapsed() {
        setStorage("widget", uid, "collapsed", (prev) => !prev);
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