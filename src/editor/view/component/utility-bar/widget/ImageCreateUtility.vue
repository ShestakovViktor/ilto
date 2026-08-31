<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {Button, Field, Scope} from "@src/editor/view/component";
import {computed, ref, watch} from "vue";
import {IconName} from "@src/shared/enum";
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/shared/view/context";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import {useStorageContext} from "@src/storage/view/context";
import {ImageCreateSingleScript, ImageCreateTiledScript} from "@src/editor/script";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {ActivitySetAction} from "@src/editor/action";
import {ImageMeasureAction} from "@src/editor/action/utility";
import {mat3} from "@src/shared/math";

const {repo: storage, graphics, stats} = useStorageContext();
const {engine, session} = useEditorContext();
const {loop, scene, canvas} = useViewerContext();

const extension = ref<string>("");
const isResizeEnabled = ref<boolean>(false);
const isTiled = ref<boolean>(false);

const draft = computed(() => {
	if (session.draft.target == ActivityTarget.Image) {
		return session.draft;
	}
	else {
		throw new Error();
	}
});

watch(isResizeEnabled, (enabled) => {
	if (!enabled) {
		draft.value.width = 0;
		draft.value.height = 0;
	}
});

async function handleSubmit(): Promise<void> {
	if (!draft.value.file) {
		throw new Error();
	}
	else if (!draft.value.width || !draft.value.height) {
		const size = await engine.apply(
			new ImageMeasureAction({file: draft.value.file})
		);
		draft.value.width = size.width;
		draft.value.height = size.height;
	}

	const data = {
		name: "",
		x: draft.value.x,
		y: draft.value.y,
		width: draft.value.width,
		height: draft.value.height,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		pivotX: draft.value.pivotX,
		pivotY: draft.value.pivotY,
		file: draft.value.file,
		parentId: draft.value.parentId,
	};

	if (!isTiled.value) {
		await engine.apply(new ImageCreateSingleScript(
			storage,
			stats,
			graphics,
			data
		));
	}
	else {
		await engine.apply(new ImageCreateTiledScript(
			storage,
			stats,
			graphics,
			data
		));
	}

	await engine.apply(new SceneUpdateAction(
		scene,
		loop,
		canvas
	));

	await engine.apply(new ActivitySetAction(
		session, {activity: {
			target: ActivityTarget.Image,
			action: ActivityAction.Create,
		}}
	));
}

function handleFileChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		extension.value = file.name.split(".").pop() || "";
		draft.value.file = file;
	}
}

const pivotButtons = [
	{pivotX: -0.5, pivotY: -0.5, icon: IconName.AnchorTL},
	{pivotX: 0, pivotY: 0, icon: IconName.AnchorMC},
];

function checkAnchorSelect(
	anchor: {pivotX: number; pivotY: number}
): boolean {
	return draft.value.pivotX == anchor.pivotX
		&& draft.value.pivotY == anchor.pivotY;
}

function handleAnchorSelect(
	anchor: {pivotX: number; pivotY: number}
): void {
	draft.value.pivotX = anchor.pivotX;
	draft.value.pivotY = anchor.pivotY;
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
				v-model.number="draft.x"
				name="x"
				type="number"
			>
		</Field>
		<Field>
			<label for="y">y</label>
			<input
				id="y"
				v-model.number="draft.y"
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
					v-model.number="draft.width"
					name="width"
					type="number"
				>
			</Field>
			<Field>
				<label for="height">height</label>
				<input
					id="height"
					v-model.number="draft.height"
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