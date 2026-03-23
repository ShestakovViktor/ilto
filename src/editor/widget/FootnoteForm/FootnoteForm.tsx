import ImageIconSvg from "@res/svg/small/image.svg";
import * as styles from "./FootnoteForm.module.scss";
import en from "./string/en.json";
import i18next from "i18next";

import {JSX, Accessor} from "solid-js";
import {TextField} from "@src/editor/widget/UtilityBar/widget";
import {Button, Dialog, Form, Modal, Toolbar} from "@src/utility/view";
import {Footnote} from "@src/entity/type";
import {FigureBrowser} from "@src/asset/widget";

i18next.addResourceBundle("en", "footnote", {FootnoteForm: en}, true, true);

type Props = {
    entity: Accessor<Footnote>;
};

export function FootnoteForm(props: Props): JSX.Element {
    let textArea: HTMLTextAreaElement | undefined;

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
    }

    const figureBrowserDialog = new Modal();
    figureBrowserDialog.render(
        <Dialog
            onClose={() => figureBrowserDialog.hide()}
        >
            <FigureBrowser
                onSelect={(ids: number[]) => {
                    const text = `<fn-figure data-entity-id="${ids[0]}"></fn-figure>`;

                    if (!textArea) return;

                    const start = textArea.selectionStart;
                    const end = textArea.selectionEnd;

                    const currentValue = textArea.value;

                    const before = currentValue.substring(0, start);
                    const after = currentValue.substring(end);
                    textArea.value = before + text + after;

                    textArea.selectionStart
                        = textArea.selectionEnd
                        = start + text.length;

                    textArea.focus();

                    figureBrowserDialog.hide();
                }}
            />
        </Dialog>
    );

    return (
        <Form class={styles.FootnoteForm} onSubmit={handleSubmit}>
            <Toolbar>
                <Button
                    icon={ImageIconSvg}
                    onClick={() => figureBrowserDialog.show()}
                />
            </Toolbar>
            <TextField ref={textArea} entity={props.entity}/>
        </Form>
    );
}