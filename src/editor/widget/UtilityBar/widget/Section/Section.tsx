import {useScopeContext} from "@src/editor/context";
import * as styles from "./Section.module.scss";
import {JSX, children, createSignal} from "solid-js";

type Config = {
    collapsed: boolean;
};

type Props = {
    children: JSX.Element | JSX.Element[];
    title: string;
    class?: string;
};

export function Section(props: Props): JSX.Element {
    const {data, setData} = useScopeContext<Config>();

    const [collapsed, setCollapsed] = createSignal(data().collapsed);

    const childs = children(() => props.children);

    function toggleCollapsed() {
        setCollapsed(!collapsed());
        setData({collapsed: collapsed()});
    }

    return (
        <div
            class={styles.Section}
            classList={{
                [styles.Expand]: collapsed(),
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
                    {collapsed() ? "-" : "+"}
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