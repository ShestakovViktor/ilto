<script setup lang="ts">
type Props = {
	pressed?: boolean;
	type?: "submit" | "button" | "reset";
};

const props = withDefaults(defineProps<Props>(), {
	pressed: false,
	type: "button",
});

const emit = defineEmits<(e: "click", event: MouseEvent) => void>();

function handleClick(event: MouseEvent): void {
	emit("click", event);
}
</script>

<template>
<button
	class="Button"
	:class="{'Pressed': props.pressed}"
	:type="props.type"
	@click="handleClick"
>
	<slot />
</button>
</template>

<style scoped lang="scss">
.Button {
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: unset;

    color: inherit;

    cursor: pointer;

	&.Pressed {
		border: 2px solid red;
	}
}
</style>