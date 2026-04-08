import {JSX} from "solid-js";
import en from "./string/en.json";
import {FileField, NameField} from "@src/editor/widget";
import {AssetKind} from "@src/core/enum";
import i18next from "i18next";
import {AssetForm} from "@src/editor/widget/AssetForm";
import {Asset} from "@src/core/type";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "prop", {PropForm: en}, true, true);

type Props = {
    onSubmit?: (AssetId: number) => void;
    onClose?: () => void;
};

export function PropForm(props: Props): JSX.Element {
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