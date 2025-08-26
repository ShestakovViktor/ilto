import {JSX} from "solid-js";
import en from "./string/en.json";
import {FileField, NameField} from "@src/asset/widget";
import {ASSET_TYPE} from "@src/asset/enum";
import {Prop} from "@src/asset/type";
import {useSharedContext} from "@src/shared/context";
import i18next from "i18next";
import {AssetForm} from "@src/asset/widget/AssetForm";

i18next.addResourceBundle("en", "prop", {PropForm: en}, true, true);

type Props = {
    onSubmit?: (AssetId: number) => void;
    onClose?: () => void;
};

export function PropForm(props: Props): JSX.Element {
    const {database} = useSharedContext();

    const [propType] = database.data.assetType
        .filter({name: ASSET_TYPE.PROP});

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const file = formData.get("file") as File;

        if (!propType) throw new Error();

        const asset = database.data.asset.create<Prop>({
            assetTypeId: propType.id,
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