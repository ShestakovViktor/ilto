import en from "./string/en.json";

import i18next from "i18next";
import {JSX} from "solid-js";
import {
    FileField,
    NameField,
} from "@src/editor/widget";
import {AssetKind} from "@src/core/enum";
import {Asset} from "@src/core/type";
import {AssetForm} from "@src/editor/widget/AssetForm";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "figure", {FigureForm: en}, true, true);

type Props = {
    onSubmit?: (AssetId: number) => void;
    onClose?: () => void;
};

export function FigureForm(props: Props): JSX.Element {
    const {storage} = useEditorContext();

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const file = formData.get("file") as File;

        const asset = storage.data.asset.create<Asset>({
            kind: AssetKind.Graphics,
            mime: file.type,
            name: file.name,
            size: file.size,
            path: URL.createObjectURL(file),
        });

        if (props.onSubmit) props.onSubmit(asset.id);
    }

    return (
        <AssetForm onSubmit={handleSubmit}>
            <NameField/>
            <FileField accept="image/*"/>
        </AssetForm>
    );
}