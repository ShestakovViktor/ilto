import en from "./string/en.json";
import i18next from "i18next";

import {Field, Input} from "@shared/view";
import {Accessor, JSX} from "solid-js";
import {useStoreContext} from "@feature/store/context";
import {Entity, Size} from "@feature/entity/type";

i18next.addResourceBundle("en", "entity", {HeightField: en}, true, true);

type Props = {
    entity: Accessor<Entity & Size>;
};

export function HeightField(props: Props): JSX.Element {
    const {store} = useStoreContext();

    function handleChange(event: Event): void {
        const target = event.target as HTMLInputElement;

        store.entity.update<Entity & {height: number}>(
            props.entity().id,
            {height: Number(target.value)}
        );
    }

    return (
        <Field>
            <label for="height">
                {i18next.t(
                    "entity:HeightField.label",
                    {postProcess: ["capitalize"]}
                )}
            </label>
            <Input
                type="number"
                name="height"
                value={String(props.entity().height)}
                onChange={handleChange}
            />
        </Field>
    );
}