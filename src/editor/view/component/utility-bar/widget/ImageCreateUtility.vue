<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {IconButton, TextButton, Field, Scope} from "@src/editor/view/component";
import {ref, watch} from "vue";
import {IconName} from "@src/core/enum";
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/context";
import {ActivityKind, InputMode} from "@src/editor/enum";
import {useCoreContext} from "@src/core/context";
import {ImageCreateScript} from "@src/editor/script";

const {storage, graphics} = useCoreContext();
const {engine, session} = useEditorContext();
const {loop, scene, canvas} = useViewerContext();

const extension = ref<string>("");
const isResizeEnabled = ref<boolean>(false);

if (session.value.activity.kind !== ActivityKind.ImageCreate) throw new Error();

const {payload} = session.value.activity;

watch(isResizeEnabled, (enabled) => {
	if (!enabled) {
		payload.width = 0;
		payload.height = 0;
	}
});

async function handleSubmit(): Promise<void> {
	if (!payload.file) {
		throw new Error();
	}

	await engine.exec(new ImageCreateScript(
		storage,
		graphics,
		{
			x: payload.x,
			y: payload.y,
			width: payload.width,
			height: payload.height,
			rotation: 0,
			scaleX: 1,
			scaleY: 1,
			pivotX: payload.pivotX,
			pivotY: payload.pivotY,
			file: payload.file,
		}
	));

	loop.requestUpdate();
	scene.update();
	await canvas.initScene();

	session.value.activity = {kind: ActivityKind.EntityCreate};
	session.value.inputMode = InputMode.DefaultView;
}

function handleFileChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		extension.value = file.name.split(".").pop() || "";
		payload.file = file;
	}
}

function handleTileChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	console.log(target.checked);
	// const file = target.files?.[0];
	// if (file) {
	// 	extension.value = file.name.split(".").pop() || "";
	// 	activity.payload.file = file;
	// }
}

const pivotButtons = [
	{pivotX: -0.5, pivotY: -0.5, icon: IconName.AnchorTL},
	{pivotX: 0, pivotY: 0, icon: IconName.AnchorMC},
];

function checkAnchorSelect(
	anchor: {pivotX: number; pivotY: number}
): boolean {
	return payload.pivotX == anchor.pivotX
		&& payload.pivotY == anchor.pivotY;
}

function handleAnchorSelect(
	anchor: {pivotX: number; pivotY: number}
): void {
	payload.pivotX = anchor.pivotX;
	payload.pivotY = anchor.pivotY;
}

</script>

<template>
<Scope name="ImageCreateUtility">
	<Widget
		title="Image create"
		class="Widget"
	>
		<Field>
			<label for="x">x</label>
			<input
				id="x"
				v-model.number="payload.x"
				name="x"
				type="number"
			>
		</Field>
		<Field>
			<label for="y">y</label>
			<input
				id="y"
				v-model.number="payload.y"
				name="y"
				type="number"
			>
		</Field>

		<div class="PivotChoose">
			<IconButton
				v-for="(button, index) in pivotButtons"
				:key="index"
				:icon="button.icon"
				:pressed="checkAnchorSelect(button)"
				@click="handleAnchorSelect(button)"
			/>
		</div>

		<Field>
			<label for="resize">resize</label>
			<input
				id="resize"
				v-model="isResizeEnabled"
				name="resize"
				type="checkbox"
			>
		</Field>
		<template v-if="isResizeEnabled">
			<Field>
				<label for="width">width</label>
				<input
					id="width"
					v-model.number="payload.width"
					name="width"
					type="number"
				>
			</Field>
			<Field>
				<label for="height">height</label>
				<input
					id="height"
					v-model.number="payload.height"
					name="height"
					type="number"
				>
			</Field>
		</template>
		<Field>
			<label for="tile">tile</label>
			<input
				id="tile"
				v-model.number="payload.tile"
				name="tile"
				type="checkbox"
				@change="handleTileChange"
			>
		</Field>
		<Field>
			<label for="image">image</label>
			<input
				id="image"
				name="image"
				type="file"
				accept="image/*"
				@change="handleFileChange"
			>
		</Field>
		<TextButton @click="handleSubmit">
			Создать
		</TextButton>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
.Widget {
	.PivotChoose {
		display: flex;
		gap: 8px;
	}
}

</style>