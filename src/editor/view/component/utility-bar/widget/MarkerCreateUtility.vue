<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {Button, Field, Scope} from "@src/editor/view/component";
import {ref} from "vue";
import {EntityKind, MimeType} from "@src/core/enum";
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/context";
import {ActivityKind, InputMode, ModalKind} from "@src/editor/enum";
import {useCoreContext} from "@src/core/context";
import {ImageCreateScript} from "@src/editor/script";

const {storage, graphics} = useCoreContext();
const {engine, session} = useEditorContext();
const {loop} = useViewerContext();

const extension = ref<string>("");

const {activity} = session.value;

if (activity.kind !== ActivityKind.MarkerCreate) {
	throw new Error();
}

async function handleCreate(
	x: number,
	y: number,
	w: number,
	h: number,
	file: File
): Promise<void> {
	await engine.exec(new ImageCreateScript(
		storage,
		graphics,
		{x, y, width: w, height: h, file}
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
	if (activity.kind !== ActivityKind.MarkerCreate) {
		throw new Error();
	}

	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		extension.value = file.name.split(".").pop() || "";
		activity.payload.file = file;
	}
}

function showAssetBrowser(): void {
	session.value.modal.push({
		kind: ModalKind.AssetBrowser,
		payload: {
			kind: EntityKind.Area,
		},
	});

}

</script>

<template>
<Scope name="MarkerCreateUtility">
	<Widget
		title="CreateMarker"
		class="Widget"
	>
		<Field>
			<label for="x">x</label>
			<input
				id="x"
				v-model.number="activity.payload.x"
				type="number"
			>
		</Field>
		<Field>
			<label for="y">y</label>
			<input
				id="y"
				v-model.number="activity.payload.y"
				type="number"
			>
		</Field>
		<Field>
			<label for="width">width</label>
			<input
				id="width"
				v-model.number="activity.payload.width"
				type="number"
			>
		</Field>
		<Field>
			<label for="height">height</label>
			<input
				id="height"
				v-model.number="activity.payload.height"
				type="number"
			>
		</Field>
		<Field>
			<label for="prop">prop</label>
			<input
				id="height"
				type="file"
				accept="image/*"
				@change="handleFileChange"
			>
		</Field>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
</style>