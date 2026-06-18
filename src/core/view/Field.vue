<script setup lang="ts">
const props = defineProps<{
	label: string;
	name: string;
	type?: string;
	value?: string;
	accept?: string;
	step?: string;
	readonly?: boolean;
	required?: boolean;
	classList?: Partial<{
		Field: string;
		Label: string;
		Input: string;
	}>;
}>();

const emit = defineEmits<{
	(e: "keydown", event: KeyboardEvent): void;
	(e: "change", event: Event): void;
	(e: "input", event: Event): void;
}>();
</script>

<template>
<div :class="['Field', props.classList?.Field]">
	<label
		:class="['Label', props.classList?.Label]"
		:for="props.name"
	>
		{{ props.label }}
	</label>
	<input
		:class="['Input', props.classList?.Input]"
		:type="props.type"
		:name="props.name"
		:step="props.step"
		:readonly="props.readonly"
		:required="props.required"
		:value="props.type !== 'file' ? props.value : undefined"
		@keydown="emit('keydown', $event)"
		@change="emit('change', $event)"
	>
</div>
</template>

<style lang="scss" scoped>
.Field {
    display: flex;
    gap: 16px;

    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    width: 100%;

    .Label {
        text-align: right;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 30%;
    }

    .Input {
        flex: 1 1 auto;
        width: 0;
    }
}
</style>