import {JSX} from "solid-js";
import en from "./string/en.json";
import {FileField, NameField} from "@src/asset/widget";
import {AssetKind} from "@src/asset/enum";
import {useSharedContext} from "@src/shared/context";
import i18next from "i18next";
import {AssetForm} from "@src/asset/widget/AssetForm";
import {Asset} from "@src/asset/type";

i18next.addResourceBundle("en", "prop", {PropForm: en}, true, true);

type Props = {
    onSubmit?: (AssetId: number) => void;
    onClose?: () => void;
};

export function PropForm(props: Props): JSX.Element {
    const {database} = useSharedContext();

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const file = formData.get("file") as File;

        const asset = database.data.asset.create<Asset>({
            kind: AssetKind.Image,
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