import en from "./string/en.json";

import i18next from "i18next";
import {JSX} from "solid-js";
import {
    FileField,
    NameField,
} from "@src/asset/widget";
import {ASSET_TYPE} from "@src/asset/enum";
import {useSharedContext} from "@src/shared/context";
import {Figure} from "@src/asset/type";
import {AssetForm} from "@src/asset/widget/AssetForm";

i18next.addResourceBundle("en", "figure", {FigureForm: en}, true, true);

type Props = {
    onSubmit?: (AssetId: number) => void;
    onClose?: () => void;
};

export function FigureForm(props: Props): JSX.Element {
    const {database} = useSharedContext();

    const [figureType] = database.data.assetType
        .filter({name: ASSET_TYPE.FIGURE});

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const file = formData.get("file") as File;

        if (!figureType) throw new Error();

        const asset = database.data.asset.create<Figure>({
            assetTypeId: figureType.id,
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