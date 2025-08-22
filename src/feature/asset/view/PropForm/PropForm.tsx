import {JSX} from "solid-js";
import en from "./string/en.json";
import {FileField, NameField} from "@feature/asset/view";
import {ASSET_TYPE} from "@feature/asset/enum";
import {Prop} from "@feature/asset/type";
import {useStoreContext} from "@feature/store/context";
import i18next from "i18next";
import {AssetForm} from "@feature/asset/view/AssetForm";

i18next.addResourceBundle("en", "prop", {PropForm: en}, true, true);

type Props = {
    onSubmit?: (AssetId: number) => void;
    onClose?: () => void;
};

export function PropForm(props: Props): JSX.Element {
    const storeContext = useStoreContext();

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const file = formData.get("file") as File;

        const asset = storeContext.store.asset.create<Prop>({
            assetTypeId: ASSET_TYPE.PROP,
            media: file.type,
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