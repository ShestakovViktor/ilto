import * as styles from "./Spoiler.module.scss";
import {JSX, children, createEffect, createSignal, on} from "solid-js";

type Props = {
    children: JSX.Element | JSX.Element[];
    title: string;
    namespace?: string;
    classList?: Partial<{
        spoiler: string;
        section: string;
        header: string;
        title: string;
        expand: string;
        content: string;
    }>;
};

export function Spoiler(props: Props): JSX.Element {
    const {classList} = props;

    const childs = children(() => props.children);

    const [getExpand, setExpand] = createSignal(false);

    createEffect(on(getExpand, () => {
        // current.state.collapsed = value;
    }));

    return (
        <div
            class={styles.Spoiler}
            classList={{
                [classList?.spoiler ?? ""]: true,
                [styles.Expanded]: getExpand(),
            }}
        >
            <div
                class={styles.Header}
                classList={{
                    [classList?.header ?? ""]: true,
                }}
                onClick={() => setExpand(!getExpand())}
            >
                <div
                    class={styles.Title}
                    classList={{
                        [classList?.title ?? ""]: true,
                    }}
                >
                    {props.title}
                </div>
                <div
                    class={styles.Expand}
                    classList={{
                        [classList?.expand ?? ""]: true,
                    }}
                >
                    {getExpand() ? "-" : "+"}
                </div>
            </div>
            <div
                class={styles.Content}
                classList={{
                    [classList?.content ?? ""]: true,
                }}
            >
                {childs()}
            </div>
        </div>
    );
}