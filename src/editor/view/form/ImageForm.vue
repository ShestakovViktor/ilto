<script setup lang="ts">
import {ref} from "vue";
import {MimeType} from "@src/core/enum";
import {Button, Field} from "@src/core/view";

const extension = ref<string>("");

export type Props = {
	x: number;
	y: number;
	onSubmit: (x: number, y: number, w: number, h: number, file: File) => void;
};

const props = defineProps<Props>();

const emit = defineEmits<{close: []}>();

function handleSubmit(event: SubmitEvent): void {
	event.preventDefault();

	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	form.reset();

	const x = Number(formData.get("x"));
	const y = Number(formData.get("y"));
	const w = Number(formData.get("width"));
	const h = Number(formData.get("height"));
	const file = formData.get("image") as File;

	props.onSubmit(x, y, w, h, file);

	emit("close");
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
		:value="String(props.x)"
	/>
	<Field
		label="y"
		type="number"
		name="y"
		:value="String(props.y)"
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
</template>

<style lang="scss" scoped>
.Form {
	width: 20em;
}
</style>