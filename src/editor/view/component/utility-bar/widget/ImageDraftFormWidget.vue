<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {Button, Field, Scope} from "@src/editor/view/component";
import {computed, ref, watch} from "vue";
import {IconName} from "@src/shared/enum";
import {useEditorContext} from "@src/editor/view/context";
import {ActivityTarget} from "@src/editor/enum";

const {session} = useEditorContext();

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

const draft = computed(() => {
	if (session.activity.target == ActivityTarget.Image) {
		return session.activity.payload.draft;
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
<Scope name="ImageDraftFormWidget">
	<Widget
		title="Image draft form"
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
				v-model="payload.tiled"
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