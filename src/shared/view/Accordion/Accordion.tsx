import * as styles from "./Accordion.module.scss";
import {For, JSX, children} from "solid-js";
import {SectionProps} from "./Section";
import {useNamespaceContext} from "@feature/app/context";
import {createLocalStorageSyncSignal} from "@feature/app/service";

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
    const namespaceContext = useNamespaceContext();

    const childs = children(() => props.children);
    const sections = childs.toArray() as unknown as SectionProps[];

    return (
        <div class={`${styles.Accordion} ${props.classList?.accordion || ""}`}>
            <For each={sections}>
                {(child) => {
                    const name = namespaceContext.namespace
                        + "."
                        + child.title
                        + "Section"
                        + "."
                        + "expand";

                    const [getExpand, setExpand]
                        = createLocalStorageSyncSignal(false, {name});

                    return (
                        <div
                            id={child.id}
                            class={`${styles.Section} ${props.classList?.section || ""}`}
                            classList={{
                                [styles.Expanded]: Boolean(getExpand()),
                            }}
                        >
                            <div
                                class={`${styles.Header} ${props.classList?.header || ""}`}
                                onClick={() => setExpand(!Boolean(getExpand()))}
                            >
                                <div class={`${styles.Title} ${props.classList?.title || ""}`}>
                                    {child.title}
                                </div>
                                <div class={`${styles.Expand} ${props.classList?.expand || ""}`}>
                                    {getExpand() ? "-" : "+"}
                                </div>
                            </div>
                            <div
                                class={`${styles.Content} ${props.classList?.content || ""}`}
                                classList={{
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