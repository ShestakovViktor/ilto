import * as styles from "./FootnoteView.module.scss";
import {Accessor, JSX, createMemo} from "solid-js";
import {Footnote} from "@src/core/type";
import {Dynamic} from "solid-js/web";
import {FootnoteFigure} from "@src/viewer/widget";

type Props = {
    entity: Accessor<Footnote>;
    ref?: HTMLDivElement;
    onMouseLeave?: (event: MouseEvent) => void;
};

export function FootnoteView(props: Props): JSX.Element {
    function renderContent(content: string): JSX.Element {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        function renderNode(node: Node): JSX.Element {
            const nodeName = node.nodeName.toLowerCase();

            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }

            if (node.nodeName === "FN-FIGURE") {
                const element = node as HTMLElement;
                const entityId = Number(element.getAttribute("data-entity-id"));
                return (
                    <FootnoteFigure entityId={entityId}>
                        {node.textContent}
                    </FootnoteFigure>
                );
            }

            const children = Array.from(node.childNodes).map(renderNode);
            return <Dynamic component={nodeName}>{children}</Dynamic>;
        }

        return renderNode(doc.body);
    }

    const content = createMemo(() => {
        return renderContent(props.entity().text);
    });

    function handleWheel(event: MouseEvent): void {
        event.stopPropagation();
    }

    return (
        <div
            class={styles.FootnoteView}
            onWheel={handleWheel}
            onMouseLeave={props.onMouseLeave}
            ref={props.ref}
        >
            {content()}
        </div>
    );
}

