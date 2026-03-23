import en from "./string/en.json";

import i18next from "i18next";
import {JSX} from "solid-js";
import {
    ClassField,
    FileField,
    NameField,
} from "@src/asset/widget";
import {AssetKind} from "@src/asset/enum";
import {AssetForm} from "@src/asset/widget/AssetForm";
import {Asset} from "@src/asset/type";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "motion", {MotionCreateDialog: en}, true, true);

type Props = {
    onSubmit?: (assetId: number) => void;
    onClose?: () => void;
};

export function MotionForm(props: Props): JSX.Element {
    const {storage} = useEditorContext();

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const file = formData.get("file") as File;
        // const cssClass = formData.get("class") as string;

        const asset = storage.data.asset.create<Asset>({
            kind: AssetKind.Keyframe,
            mime: file.type,
            name: file.name,
            size: file.size,
            path: URL.createObjectURL(file),
            // class: cssClass,
        });

        if (props.onSubmit) props.onSubmit(asset.id);
    }
    return (
        <AssetForm onSubmit={handleSubmit}>
            <NameField/>
            <ClassField/>
            <FileField accept="text/css"/>
        </AssetForm>
    );
}