import {useCoreContext} from "@src/core/context";
import {CreateImageAction, Script} from "@src/editor/action";
import {CreateAssetAction, SetChildAction} from "@src/editor/action/storage";
import {useEditorContext} from "@src/editor/context";
import {MimeType} from "@src/core/enum";
import {Field} from "@src/editor/widget/Editor/widget";
import {createSignal, JSX, Match, Switch} from "solid-js";

type Props = {
    x: number;
    y: number;
};

export function ImageForm(props: Props): JSX.Element {
    const {imager} = useCoreContext();
    const {storage, engine} = useEditorContext();
    const [extension, setExtension] = createSignal<string>("");

    function handleSubmit(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        form.reset();

        const x = Number(formData.get("x"));
        const y = Number(formData.get("y"));
        const width = Number(formData.get("width"));
        const height = Number(formData.get("height"));
        const file = formData.get("background") as File;

        engine.exec(new Script(async (exec) => {
            let files: {x: number; y: number; w: number; h: number; f: File}[] = [];
            if (file.type == MimeType.Svg) {
                files = [{x, y, w: width, h: height, f: await imager.prepareSvg(file)}];
            }
            else {
                files = await imager.prepareImg(file, width, height, 32);
            }

            await Promise.all(files.map(async(graphics) => {
                const asset = await exec(new CreateAssetAction(storage, {
                    path: URL.createObjectURL(graphics.f),
                    size: graphics.f.size,
                    mime: graphics.f.type,
                    name: graphics.f.name,
                    meta: {footnote: ""},
                }));

                const image = await exec(new CreateImageAction(storage, {
                    x: graphics.x,
                    y: graphics.y,
                    width: graphics.w,
                    height: graphics.h,
                    assetId: asset.id,
                }));

                await exec(new SetChildAction(storage, {
                    parentId: 1,
                    childId: image.id,
                }));

            }));
        }));

        event.preventDefault();
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const ext = file.name.split(".").pop() || "";
            setExtension(ext);
        }
    }

    return (
        <form
            id="entity-form"
            onSubmit={handleSubmit}
        >
            <Field
                label={"x"}
                type="number"
                name="x"
                value={String(props.x)}
            />
            <Field
                label={"y"}
                type="number"
                name="y"
                value={String(props.y)}
            />
            <Field
                label={"width"}
                type="number"
                name="width"
            />
            <Field
                label={"height"}
                type="number"
                name="height"
            />
            <Field
                label={"image"}
                name="background"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <Switch>
                <Match when={extension() == MimeType.Png}>
                    <h1>Сколько тайлов нужно?</h1>
                </Match>
            </Switch>
        </form>
    );
}

