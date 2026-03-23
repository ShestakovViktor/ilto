import * as styles from "./FootnoteDialog.module.scss";
import en from "./string/en.json";
import i18next from "i18next";
import {Accessor, createMemo, JSX} from "solid-js";
import {Dialog} from "@src/utility/view";
import {FootnoteForm} from "@src/editor/widget";
import {Entity} from "@src/entity/type";
import {Footnote} from "@src/entity/type";
import {useViewerContext} from "@src/viewer/context";

i18next.addResourceBundle("en", "footnote", {FootnoteDialog: en}, true, true);

type Props = {
    entity: Accessor<Entity & {footnoteId: number | null}>;
    onClose: () => void;
};

export function FootnoteDialog(props: Props): JSX.Element {
    const {storage} = useViewerContext();

    const footnote = createMemo(() => {
        const footnoteId = props.entity().footnoteId;
        if (!footnoteId) throw new Error();

        const footnote = storage.data.entity.select<Footnote>(footnoteId);
        if (!footnote) throw new Error();

        return footnote;
    });

    return (
        <Dialog
            class={styles.FootnoteDialog}
            title={i18next.t(
                "footnote:FootnoteDialog.title",
                {postProcess: ["capitalize"]}
            )}
            onClose={props.onClose}
        >
            <FootnoteForm entity={footnote}/>
        </Dialog>
    );
}

