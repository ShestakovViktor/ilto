<script setup lang="ts">
import {Widget} from "@src/editor/view/utility-bar";
import {Button, Field} from "@src/core/view";
import {Scope} from "@src/editor/view";
import {ref} from "vue";
import {MimeType} from "@src/core/enum";
import {useEditorContext} from "@src/editor/context";
import {useViewerContext} from "@src/viewer/context";
import {ActivityKind, InputMode} from "@src/editor/enum";
import {useCoreContext} from "@src/core/context";
import {CreateImageScript} from "@src/editor/script";

const {storage, graphics} = useCoreContext();
const {engine, session} = useEditorContext();
const {loop} = useViewerContext();

const extension = ref<string>("");

let x = 0;
let y = 0;

if (
	session.value.activity.kind == ActivityKind.ImageCreate
) {
	x = session.value.activity.payload.x;
	y = session.value.activity.payload.y;
}

async function handleCreate(
	x: number,
	y: number,
	w: number,
	h: number,
	file: File
): Promise<void> {
	await engine.exec(new CreateImageScript(
		storage,
		graphics,
		{x, y, w, h, file}
	));

	loop.requestUpdate();

	session.value.activity = {kind: ActivityKind.EntityCreate};
	session.value.inputMode = InputMode.DefaultView;
}

async function handleSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	form.reset();

	const x = Number(formData.get("x"));
	const y = Number(formData.get("y"));
	const w = Number(formData.get("width"));
	const h = Number(formData.get("height"));
	const file = formData.get("image") as File;

	await handleCreate(x, y, w, h, file);
}

function handleFileChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		extension.value = file.name.split(".").pop() || "";
	}
}
</script>

<template>
<Scope name="CreateImageUtility">
	<Widget
		title="Create entity"
		class="Widget"
	>
		<form
			id="entity-form"
			class="Form"
			method="post"
			enctype="multipart/form-data"
			@submit="handleSubmit"
		>
			<Field
				label="x"
				type="number"
				name="x"
				:value="String(x)"
			/>
			<Field
				label="y"
				type="number"
				name="y"
				:value="String(y)"
			/>
			<Field
				label="width"
				type="number"
				name="width"
			/>
			<Field
				label="height"
				type="number"
				name="height"
			/>
			<Field
				label="image"
				name="image"
				type="file"
				accept="image/*"
				@change="handleFileChange"
			/>
			<h1 v-if="extension === MimeType.Png">
				Сколько тайлов нужно?
			</h1>
			<Button type="submit">
				Создать
			</Button>
		</form>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
.Panel {
    display: flex;
    flex-direction: column;
	justify-content: left;
	gap: 8px;
	width: fit-content;

	.Button {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;

		.Icon {
			height: 42px;
			width: 42px;
			padding: 8px;
			border: 1px solid lightgray;
			border-radius: 8px;
		}
	}
}
</style>