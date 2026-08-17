<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {Button, Field, Scope} from "@src/editor/view/component";
import {computed, ref, watch} from "vue";
import {IconName} from "@src/core/enum";
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/view/context";
import {ActivityKind, InputKind} from "@src/editor/enum";
import {useCoreContext} from "@src/core/view/context";
import {ImageCreateSingleScript, ImageCreateTiledScript} from "@src/editor/script";
import {SceneUpdateAction} from "@src/viewer/action";
import {ActivitySetAction, InputSetAction} from "@src/editor/action";
import {ImageMeasureAction} from "@src/editor/action/utility";

const {storage, graphics, stats} = useCoreContext();
const {engine, session} = useEditorContext();
const {loop, scene, canvas} = useViewerContext();

const extension = ref<string>("");
const isResizeEnabled = ref<boolean>(false);
const isTiled = ref<boolean>(false);

const payload = computed(() => {
	if (session.activity.kind !== ActivityKind.ImageCreate) throw new Error();
	return session.activity.payload;
});

watch(isResizeEnabled, (enabled) => {
	if (!enabled) {
		payload.value.width = 0;
		payload.value.height = 0;
	}
});

async function handleSubmit(): Promise<void> {
	if (!payload.value.file) {
		throw new Error();
	}
	else if (!payload.value.width || !payload.value.height) {
		const size = await engine.exec(
			new ImageMeasureAction({file: payload.value.file})
		);
		payload.value.width = size.width;
		payload.value.height = size.height;
	}

	const data = {
		name: "",
		x: payload.value.x,
		y: payload.value.y,
		width: payload.value.width,
		height: payload.value.height,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		pivotX: payload.value.pivotX,
		pivotY: payload.value.pivotY,
		file: payload.value.file,
		parentId: payload.value.parentId,
	};

	if (!isTiled.value) {
		await engine.exec(new ImageCreateSingleScript(
			storage,
			stats,
			graphics,
			data
		));
	}
	else {
		await engine.exec(new ImageCreateTiledScript(
			storage,
			stats,
			graphics,
			data
		));
	}

	await engine.exec(new SceneUpdateAction(
		scene,
		loop,
		canvas
	));

	await engine.exec(new ActivitySetAction(
		session, {activity: {kind: ActivityKind.EntityCreate}}
	));

	await engine.exec(new InputSetAction(
		session, {input: InputKind.DefaultView}
	));
}

function handleFileChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		extension.value = file.name.split(".").pop() || "";
		payload.value.file = file;
	}
}

const pivotButtons = [
	{pivotX: -0.5, pivotY: -0.5, icon: IconName.AnchorTL},
	{pivotX: 0, pivotY: 0, icon: IconName.AnchorMC},
];

function checkAnchorSelect(
	anchor: {pivotX: number; pivotY: number}
): boolean {
	return payload.value.pivotX == anchor.pivotX
		&& payload.value.pivotY == anchor.pivotY;
}

function handleAnchorSelect(
	anchor: {pivotX: number; pivotY: number}
): void {
	payload.value.pivotX = anchor.pivotX;
	payload.value.pivotY = anchor.pivotY;
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
			<Button
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
				v-model="isTiled"
				name="tile"
				type="checkbox"
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
		<Button
			label="Создать"
			@click="handleSubmit"
		/>
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