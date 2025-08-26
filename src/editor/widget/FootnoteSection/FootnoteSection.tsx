import en from "./string/en.json";
import i18next from "i18next";
import FootnoteIconSvg from "@res/svg/small/footnote.svg";

import {Button, Modal, Section, Toolbar} from "@src/shared/view";
import {Accessor, JSX} from "solid-js";
import {FootnoteDialog} from "@src/entity/widget";
import {Entity} from "@src/entity/type";

i18next.addResourceBundle("en", "entity", {FootnoteSection: en}, true, true);

type Props = {
    entity: Accessor<Entity & {footnoteId: number | null}>;
};

export function FootnoteSection(props: Props): JSX.Element {

    const footnoteDialog = new Modal();
    footnoteDialog.render(
        <FootnoteDialog
            entity={props.entity}
            onClose={() => footnoteDialog.hide()}
        />
    );

    return (
        <Section
            title={i18next.t(
                "entity:FootnoteSection.title",
                {postProcess: ["capitalize"]}
            )}
        >
            <Toolbar>
                <Button
                    icon={FootnoteIconSvg}
                    onClick={() => {
                        footnoteDialog.show();
                    }}
                />
            </Toolbar>
        </Section>
    );
}