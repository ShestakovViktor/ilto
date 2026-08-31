<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {Button, Field, Scope} from "@src/editor/view/component";
import {computed, ref, watch} from "vue";
import {IconName} from "@src/shared/enum";
import {useEditorContext} from "@src/editor/view/context";
import {ActivityTarget} from "@src/editor/enum";
import {ImageMeasureAction} from "@src/editor/action/utility";

const {session, engine} = useEditorContext();

const extension = ref<string>("");
const isResizeEnabled = ref<boolean>(false);

const payload = computed(() => {
	if (session.activity.target == ActivityTarget.Image) {
		return session.activity.payload;
	}
	else {
		throw new Error();
	}
});

// watch(isResizeEnabled, (enabled) => {
// 	if (!enabled) {
// 		payload.value.width = 0;
// 		payload.value.height = 0;
// 	}
// });

async function handleFileChange(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;

	extension.value = file.name.split(".").pop() || "";
	payload.value.file = file;

	if (!payload.value.width || !payload.value.height) {
		const size = await engine.exec(
			new ImageMeasureAction({file: payload.value.file})
		);

		payload.value.width = size.width;
		payload.value.height = size.height;
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
<Scope name="ImageDraftFormWidget">
	<Widget
		title="Image draft form"
		class="Widget"
	>
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
		<Field>
			<label for="tile">tile</label>
			<input
				id="tile"
				v-model="payload.isTiled"
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