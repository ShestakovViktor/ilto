import * as styles from "./Accordion.module.scss";
import {For, JSX, children, createSignal} from "solid-js";
import {SectionProps} from "./Section";

type Props = {
    children: JSX.Element | JSX.Element[];
    classList?: Partial<{
        accordion: string;
        section: string;
        header: string;
        title: string;
        expand: string;
        content: string;
    }>;
};

export function Accordion(props: Props): JSX.Element {
    const {classList} = props;

    const childs = children(() => props.children);

    return (
        <div
            class={styles.Accordion}
            classList={{
                [classList?.accordion ?? ""]: true,
            }}
        >
            <For each={childs.toArray() as unknown as SectionProps[]}>
                {(child) => {
                    // const name = namespaceContext.namespace
                    //     + "."
                    //     + child.title
                    //     + "Section"
                    //     + "."
                    //     + "expand";

                    const [getExpand, setExpand] = createSignal(false);

                    return (
                        <div
                            id={child.id}
                            class={styles.Section}
                            classList={{
                                [classList?.section ?? ""]: true,
                                [styles.Expanded]: Boolean(getExpand()),
                            }}
                        >
                            <div
                                class={styles.Header}
                                classList={{
                                    [classList?.header ?? ""]: true,
                                }}
                                onClick={() => setExpand(!Boolean(getExpand()))}
                            >
                                <div
                                    class={styles.Title}
                                    classList={{
                                        [classList?.title ?? ""]: true,
                                    }}
                                >
                                    {child.title}
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
                                    [child.class!]: Boolean(child.class),
                                }}
                            >
                                {child.children}
                            </div>
                        </div>
                    );
                }}
            </For>
        </div>
    );
}