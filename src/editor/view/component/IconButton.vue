<script setup lang="ts">
import {IconName} from "@src/core/enum";
import {Icon} from "@src/editor/view/component";

type Props = {
	pressed?: boolean;
	type?: "submit" | "button" | "reset";
	icon?: IconName;
};

const props = withDefaults(defineProps<Props>(), {
	pressed: false,
	type: "button",
	icon: IconName.Marker,
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
	<Icon :name="props.icon" />
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

	border: unset;
	outline: unset;

	width: 42px;
	height: 42px;
	border: 1px solid var(--gray-60);
	border-radius: .5em;

	&.Pressed {
		border: 1px solid var(--red-30);
		color: var(--red-30);
	}

	.Icon {
		width: 24px;
		height: 24px;
	}
}
</style>